'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import PaystackButton from '@/components/PaystackButton'
import { useRouter } from 'next/navigation'
import CartSidebar from '@/components/CartSidebar'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const [user, setUser] = useState<{ email: string; id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [reference, setReference] = useState('')
  const [processing, setProcessing] = useState(false)
  const router = useRouter()
  const tax = totalPrice * 0.075
  const total = totalPrice + tax

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({ email: data.user.email!, id: data.user.id })
      }
      setLoading(false)
    })
    setReference(`SVC-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`)
  }, [])

  const handlePaymentSuccess = async (ref: string) => {
    setProcessing(true)
    try {
      const res = await fetch('/api/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: ref, userId: user?.id, items, total }),
      })
      const data = await res.json()
      if (data.success) {
        clearCart()
        router.push(`/orders?success=true&ref=${ref}`)
      } else {
        toast.error('Payment verification failed')
      }
    } catch {
      toast.error('An error occurred. Please contact support.')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-xl mb-4">Your cart is empty</p>
        <Link href="/services" className="bg-blue-700 text-white px-6 py-3 rounded-lg">
          Browse Services
        </Link>
      </div>
    )
  }

  return (
    <>
      <CartSidebar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4 text-lg">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.name} × {item.quantity}</span>
                  <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (7.5%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-blue-700">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4 text-lg">Payment</h2>
            {!user ? (
              <div className="text-center py-4">
                <p className="text-gray-600 mb-4">Please sign in to complete your purchase</p>
                <Link
                  href="/auth/login?redirect=/checkout"
                  className="bg-blue-700 text-white px-6 py-3 rounded-lg block text-center"
                >
                  Sign In
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Paying as:</p>
                  <p className="font-medium text-gray-800">{user.email}</p>
                </div>
                {processing ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mx-auto mb-2"></div>
                    <p className="text-gray-600">Processing your order...</p>
                  </div>
                ) : (
                  <PaystackButton
                    email={user.email}
                    amount={Math.round(total * 100)}
                    reference={reference}
                    publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!}
                    onSuccess={handlePaymentSuccess}
                    onClose={() => toast.error('Payment cancelled')}
                    text={`Pay ${formatCurrency(total)}`}
                  />
                )}
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Secured by Paystack 🔒
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
