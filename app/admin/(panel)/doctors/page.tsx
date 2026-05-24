import { tryCreateAdminClient } from '@/lib/admin-db'
import DoctorsManager from './doctors-manager'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getDoctors() {
  const supabase = tryCreateAdminClient()
  if (!supabase) return []
  const { data } = await supabase.from('doctors').select('*').order('name')
  return data ?? []
}

export default async function DoctorsPage() {
  const doctors = await getDoctors()

  return (
    <div>
      <h1 className="admin-page-title">Doctors</h1>
      <p className="admin-page-sub">
        {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} — active profiles appear on the public site
      </p>
      <DoctorsManager initialDoctors={doctors} />
    </div>
  )
}
