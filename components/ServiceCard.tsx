'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/utils'
import { FiShoppingCart } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface Service {
  id: string
  name: string
  description: string
  price: number
  image_url?: string
  category?: string
}

export default function ServiceCard({ service }: { service: Service }) {
  const { addItem, openCart } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: service.id,
      name: service.name,
      price: service.price,
      quantity: 1,
      image_url: service.image_url,
    })
    toast.success(`${service.name} added to cart!`)
    openCart()
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden">
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100">
        {service.image_url ? (
          <Image
            src={service.image_url}
            alt={service.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-6xl">💼</span>
          </div>
        )}
        {service.category && (
          <span className="absolute top-3 right-3 bg-blue-700 text-white text-xs px-2 py-1 rounded-full">
            {service.category}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-1">{service.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{service.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-blue-700 font-bold text-xl">{formatCurrency(service.price)}</span>
          <div className="flex gap-2">
            <Link
              href={`/services/${service.id}`}
              className="text-sm text-gray-600 border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Details
            </Link>
            <button
              onClick={handleAddToCart}
              className="bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors flex items-center gap-1"
            >
              <FiShoppingCart className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
