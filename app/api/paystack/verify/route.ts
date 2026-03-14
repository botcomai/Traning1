import { NextRequest, NextResponse } from 'next/server'
import { verifyPaystackTransaction } from '@/lib/paystack'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { reference, userId, items, total } = await request.json()

    if (!reference) {
      return NextResponse.json({ error: 'Reference is required' }, { status: 400 })
    }

    const verification = await verifyPaystackTransaction(reference)

    if (verification.data.status !== 'success') {
      return NextResponse.json({ error: 'Payment not successful' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: total,
        status: 'paid',
        payment_reference: reference,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Order creation error:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    if (items && items.length > 0) {
      const orderItems = items.map((item: { id: string; name: string; price: number; quantity: number }) => ({
        order_id: order.id,
        service_id: item.id,
        price: item.price,
        quantity: item.quantity,
      }))

      await supabase.from('order_items').insert(orderItems)
    }

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Verification failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
