import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminServicesClient from './AdminServicesClient'

export default async function AdminServicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false })

  return <AdminServicesClient initialServices={services || []} />
}
