import { createClient } from '@/lib/supabase/server'
import CartSidebar from '@/components/CartSidebar'
import ServiceDetailClient from './ServiceDetailClient'
import { notFound } from 'next/navigation'

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single()

  if (!service) notFound()

  return (
    <>
      <CartSidebar />
      <ServiceDetailClient service={service} />
    </>
  )
}
