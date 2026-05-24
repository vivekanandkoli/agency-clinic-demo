import { tryCreateAdminClient } from '@/lib/admin-db'
import BookingsTable from './bookings-table'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getBookings() {
  const supabase = tryCreateAdminClient()
  if (!supabase) return []
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
      <h1 className="admin-page-title">Bookings</h1>
      <p className="admin-page-sub">
        {bookings.length} total booking{bookings.length !== 1 ? 's' : ''}
      </p>
      <BookingsTable initialBookings={bookings} />
    </div>
  )
}
