'use client'

import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

interface PaystackButtonProps {
  email: string
  amount: number
  reference: string
  publicKey: string
  onSuccess: (reference: string) => void
  onClose: () => void
  text?: string
  className?: string
  disabled?: boolean
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string
        email: string
        amount: number
        ref: string
        currency: string
        callback: (response: { reference: string }) => void
        onClose: () => void
      }) => { openIframe: () => void }
    }
  }
}

export default function PaystackButton({
  email,
  amount,
  reference,
  publicKey,
  onSuccess,
  onClose,
  text = 'Pay Now',
  className = '',
  disabled = false,
}: PaystackButtonProps) {
  const scriptLoaded = useRef(false)

  useEffect(() => {
    if (!scriptLoaded.current) {
      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.async = true
      document.body.appendChild(script)
      scriptLoaded.current = true
    }
  }, [])

  const handlePayment = () => {
    if (!window.PaystackPop) {
      toast.error('Paystack is loading. Please try again.')
      return
    }

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount,
      ref: reference,
      currency: 'NGN',
      callback: (response) => {
        onSuccess(response.reference)
      },
      onClose,
    })
    handler.openIframe()
  }

  return (
    <button
      onClick={handlePayment}
      disabled={disabled}
      className={className || 'w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'}
    >
      {text}
    </button>
  )
}
