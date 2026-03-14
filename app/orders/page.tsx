import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils'
import Link from 'next/link'
import CartSidebar from '@/components/CartSidebar'

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; ref?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/orders')
  }

  const { data: orders } = await supabase
    .from('orders')
    .select(`*, order_items(*, services(name))`)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <>
      <CartSidebar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {params.success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-green-700 font-semibold text-lg">🎉 Payment Successful!</p>
            <p className="text-green-600 text-sm mt-1">
              Your order has been confirmed. Reference: {params.ref}
            </p>
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
        {!orders || orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-xl mb-4">No orders yet</p>
            <Link href="/services" className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors">
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order.id.substring(0, 8).toUpperCase()}</p>
                    <p className="text-sm text-gray-400">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="font-bold text-blue-700 mt-1">{formatCurrency(order.total_amount)}</p>
                  </div>
                </div>
                {order.order_items && order.order_items.length > 0 && (
                  <div className="border-t pt-3">
                    {order.order_items.map((item: { id: string; service_id: string; quantity: number; price: number; services?: { name: string } }) => (
                      <div key={item.id} className="flex justify-between text-sm py-1">
                        <span className="text-gray-700">
                          {item.services?.name || 'Service'} × {item.quantity}
                        </span>
                        <span className="text-gray-500">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                )}
                {order.payment_reference && (
                  <p className="text-xs text-gray-400 mt-2">Ref: {order.payment_reference}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
