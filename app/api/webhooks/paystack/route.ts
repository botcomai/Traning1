import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    const secret = process.env.PAYSTACK_SECRET_KEY!
    const hash = createHmac('sha512', secret).update(body).digest('hex')

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)

    switch (event.event) {
      case 'charge.success':
        console.log('Payment successful:', event.data.reference)
        break
      default:
        console.log('Unhandled event:', event.event)
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
