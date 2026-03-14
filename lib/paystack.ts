export const PAYSTACK_BASE_URL = 'https://api.paystack.co'

export async function initializePaystackTransaction(data: {
  email: string
  amount: number
  reference?: string
  callback_url?: string
  metadata?: Record<string, unknown>
}) {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to initialize payment')
  }

  return response.json()
}

export async function verifyPaystackTransaction(reference: string) {
  const response = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to verify payment')
  }

  return response.json()
}

export function generateReference() {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  return `SVC-${timestamp}-${random}`
}
