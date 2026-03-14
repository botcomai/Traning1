import { NextRequest, NextResponse } from 'next/server'
import { initializePaystackTransaction, generateReference } from '@/lib/paystack'

export async function POST(request: NextRequest) {
  try {
    const { email, amount, metadata } = await request.json()

    if (!email || !amount) {
      return NextResponse.json({ error: 'Email and amount are required' }, { status: 400 })
    }

    const reference = generateReference()

    const data = await initializePaystackTransaction({
      email,
      amount: Math.round(amount * 100),
      reference,
      metadata,
    })

    return NextResponse.json({ success: true, data: data.data })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to initialize payment'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
