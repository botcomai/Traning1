'use client'

import Link from 'next/link'
import CartItem from '@/components/CartItem'
import CartSidebar from '@/components/CartSidebar'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/utils'
import { FiTrash2 } from 'react-icons/fi'

export default function CartPage() {
  const { items, clearCart, totalPrice } = useCart()

  const tax = totalPrice * 0.075
  const total = totalPrice + tax

  return (
    <>
      <CartSidebar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
            >
              <FiTrash2 className="w-4 h-4" />
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-500 text-xl mb-4">Your cart is empty</p>
            <Link
              href="/services"
              className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
              <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (7.5%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-700">{formatCurrency(total)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block w-full bg-blue-700 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors mt-4"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
