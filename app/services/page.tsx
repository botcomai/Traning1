import { createClient } from '@/lib/supabase/server'
import ServiceCard from '@/components/ServiceCard'
import CartSidebar from '@/components/CartSidebar'

export const revalidate = 60

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (params.category) {
    query = query.eq('category', params.category)
  }

  if (params.q) {
    query = query.ilike('name', `%${params.q}%`)
  }

  const { data: services } = await query

  const { data: categories } = await supabase
    .from('services')
    .select('category')
    .eq('is_active', true)
    .not('category', 'is', null)

  const uniqueCategories = Array.from(new Set(categories?.map((c) => c.category).filter(Boolean)))

  return (
    <>
      <CartSidebar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Services</h1>
        <p className="text-gray-500 mb-6">Browse and book professional services</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <form method="get" className="flex-1 flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={params.q}
              placeholder="Search services..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition-colors"
            >
              Search
            </button>
          </form>
          <div className="flex gap-2 flex-wrap">
            <a
              href="/services"
              className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                !params.category
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              All
            </a>
            {uniqueCategories.map((cat) => (
              <a
                key={cat}
                href={`/services?category=${encodeURIComponent(cat)}`}
                className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                  params.category === cat
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat}
              </a>
            ))}
          </div>
        </div>

        {services && services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No services found.</p>
            <a href="/services" className="text-blue-700 hover:underline mt-2 block">
              Clear filters
            </a>
          </div>
        )}
      </div>
    </>
  )
}
