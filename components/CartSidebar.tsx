'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import CartItem from './CartItem'
import { formatCurrency } from '@/lib/utils'
import { FiX, FiShoppingBag } from 'react-icons/fi'

export default function CartSidebar() {
  const { items, isOpen, closeCart, totalPrice } = useCart()

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeCart}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Shopping Cart</h2>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <FiShoppingBag className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-1">Add some services to get started</p>
              <Link
                href="/services"
                onClick={closeCart}
                className="mt-4 text-blue-700 hover:underline text-sm"
              >
                Browse Services
              </Link>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span className="text-gray-600">Tax (7.5%)</span>
              <span className="font-medium">{formatCurrency(totalPrice * 0.075)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
              <span className="text-blue-700">{formatCurrency(totalPrice * 1.075)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-blue-700 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block w-full text-center py-2 mt-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
