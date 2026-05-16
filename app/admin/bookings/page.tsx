import { createAdminClient } from '@/lib/supabase/server'
import BookingsTable from './bookings-table'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getBookings() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*, services(name), doctors(name)')
    .order('appointment_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookings:', error)
    return []
  }
  return data ?? []
}

export default async function BookingsPage() {
  const bookings = await getBookings()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Bookings</h1>
          <p style={{ color: 'var(--mid)' }}>{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
      <BookingsTable initialBookings={bookings} />
    </div>
  )
}
