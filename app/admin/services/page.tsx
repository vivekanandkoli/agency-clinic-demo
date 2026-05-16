import { createAdminClient } from '@/lib/supabase/server'
import ServicesManager from './services-manager'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getServices() {
  const supabase = createAdminClient()
  const { data } = await supabase.from('services').select('*').order('name')
  return data ?? []
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Services</h1>
        <p style={{ color: 'var(--mid)' }}>{services.length} service{services.length !== 1 ? 's' : ''} configured</p>
      </div>
      <ServicesManager initialServices={services} />
    </div>
  )
}
