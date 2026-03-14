import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import AdminOrdersTable from './AdminOrdersTable'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  const { data: orders } = await supabase.from('orders').select('*')
  const { data: services } = await supabase.from('services').select('id')
  const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })

  const totalRevenue = orders?.filter(o => o.status === 'paid' || o.status === 'completed')
    .reduce((sum, o) => sum + Number(o.total_amount), 0) || 0
  const totalOrders = orders?.length || 0
  const totalServices = services?.length || 0

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: '💰' },
    { label: 'Total Orders', value: totalOrders.toString(), icon: '📦' },
    { label: 'Services', value: totalServices.toString(), icon: '🛠️' },
    { label: 'Users', value: (usersCount || 0).toString(), icon: '👥' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <Link
          href="/admin/services"
          className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          Manage Services
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-gray-500 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-800">Recent Orders</h2>
        </div>
        <AdminOrdersTable orders={orders || []} />
      </div>
    </div>
  )
}
