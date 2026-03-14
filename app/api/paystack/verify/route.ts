import { NextRequest, NextResponse } from 'next/server'
import { verifyPaystackTransaction } from '@/lib/paystack'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { reference, userId, items } = await request.json()

    if (!reference) {
      return NextResponse.json({ error: 'Reference is required' }, { status: 400 })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items are required' }, { status: 400 })
    }

    const verification = await verifyPaystackTransaction(reference)

    if (verification.data.status !== 'success') {
      return NextResponse.json({ error: 'Payment not successful' }, { status: 400 })
    }

    const supabase = await createClient()

    // Fetch authoritative prices from DB to prevent client-side price manipulation
    const serviceIds: string[] = items.map((item: { id: string }) => item.id)
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('id, price')
      .in('id', serviceIds)

    if (servicesError || !services) {
      return NextResponse.json({ error: 'Failed to fetch service prices' }, { status: 500 })
    }

    const priceMap = new Map(services.map((s: { id: string; price: number }) => [s.id, s.price]))

    // Compute server-side total from DB prices
    const serverTotal = items.reduce((sum: number, item: { id: string; quantity: number }) => {
      const price = priceMap.get(item.id) ?? 0
      return sum + price * item.quantity
    }, 0)
    const TAX_RATE = 0.075
    const serverTotalWithTax = serverTotal * (1 + TAX_RATE)

    // Verify the Paystack amount matches (amount is in kobo)
    const paidAmountNGN = verification.data.amount / 100
    if (Math.abs(paidAmountNGN - serverTotalWithTax) > 1) {
      return NextResponse.json({ error: 'Payment amount mismatch' }, { status: 400 })
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: serverTotalWithTax,
        status: 'paid',
        payment_reference: reference,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    const orderItems = items.map((item: { id: string; quantity: number }) => ({
      order_id: order.id,
      service_id: item.id,
      price: priceMap.get(item.id) ?? 0,
      quantity: item.quantity,
    }))

    await supabase.from('order_items').insert(orderItems)

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Verification failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
