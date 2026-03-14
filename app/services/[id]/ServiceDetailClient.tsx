'use client'

import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/utils'
import { FiShoppingCart, FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface Service {
  id: string
  name: string
  description: string
  price: number
  image_url?: string
  category?: string
  created_at: string
}

export default function ServiceDetailClient({ service }: { service: Service }) {
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/services" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-700 mb-6">
        <FiArrowLeft /> Back to Services
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl overflow-hidden">
          {service.image_url ? (
            <Image src={service.image_url} alt={service.name} fill className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-8xl">💼</span>
            </div>
          )}
        </div>
        <div>
          {service.category && (
            <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">{service.category}</span>
          )}
          <h1 className="text-3xl font-bold text-gray-800 mt-3 mb-4">{service.name}</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
          <div className="text-3xl font-bold text-blue-700 mb-6">{formatCurrency(service.price)}</div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
          >
            <FiShoppingCart />
            Add to Cart
          </button>
          <Link
            href="/checkout"
            onClick={handleAddToCart}
            className="block w-full text-center border-2 border-blue-700 text-blue-700 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors mt-3"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  )
}
