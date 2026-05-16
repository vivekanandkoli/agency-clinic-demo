import { createAdminClient } from '@/lib/supabase/server'
import DoctorsManager from './doctors-manager'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getDoctors() {
  const supabase = createAdminClient()
  const { data } = await supabase.from('doctors').select('*').order('name')
  return data ?? []
}

export default async function DoctorsPage() {
  const doctors = await getDoctors()

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Doctors</h1>
        <p style={{ color: 'var(--mid)' }}>{doctors.length} doctor{doctors.length !== 1 ? 's' : ''} on staff</p>
      </div>
      <DoctorsManager initialDoctors={doctors} />
    </div>
  )
}
