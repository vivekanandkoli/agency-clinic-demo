import { tryCreateAdminClient } from '@/lib/admin-db'
import ServicesManager from './services-manager'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getServices() {
  const supabase = tryCreateAdminClient()
  if (!supabase) return []
  const { data } = await supabase.from('services').select('*').order('name')
  return data ?? []
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div>
      <h1 className="admin-page-title">Services</h1>
      <p className="admin-page-sub">
        {services.length} service{services.length !== 1 ? 's' : ''} — active items appear on the public site
      </p>
      <ServicesManager initialServices={services} />
    </div>
  )
}
