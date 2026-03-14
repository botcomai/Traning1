'use client'

import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/utils'
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi'

interface CartItemProps {
  item: {
    id: string
    name: string
    price: number
    quantity: number
    image_url?: string
  }
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCart()

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100">
      <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
        {item.image_url ? (
          <Image src={item.image_url} alt={item.name} width={56} height={56} className="object-cover rounded-lg" />
        ) : (
          <span className="text-2xl">💼</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
        <p className="text-blue-700 font-semibold text-sm">{formatCurrency(item.price)}</p>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
        >
          <FiMinus className="w-3 h-3" />
        </button>
        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
        >
          <FiPlus className="w-3 h-3" />
        </button>
        <button
          onClick={() => removeItem(item.id)}
          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded ml-1"
        >
          <FiTrash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
