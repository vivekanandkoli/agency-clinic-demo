export const dynamic = 'force-dynamic'
export const revalidate = 0

import Link from 'next/link'
import AdminSeedButton from '@/components/admin-seed-button'
import { tryCreateAdminClient } from '@/lib/admin-db'
import { isMissingTableError } from '@/lib/supabase-errors'

const EMPTY_STATS = {
  totalBookings: 0,
  pendingBookings: 0,
  confirmedBookings: 0,
  todayBookings: 0,
  totalServices: 0,
  totalDoctors: 0,
  totalContacts: 0,
  tablesMissing: true,
}

async function getStats() {
  const supabase = tryCreateAdminClient()
  if (!supabase) {
    return { ...EMPTY_STATS, tablesMissing: false }
  }

  const probe = await supabase.from('services').select('id').limit(1)
  if (isMissingTableError(probe.error)) {
    return EMPTY_STATS
  }

  const [bookingsRes, servicesRes, doctorsRes, contactRes] = await Promise.all([
    supabase.from('bookings').select('id, status, created_at', { count: 'exact' }),
    supabase.from('services').select('id', { count: 'exact' }),
    supabase.from('doctors').select('id', { count: 'exact' }),
    supabase.from('contact_submissions').select('id', { count: 'exact' }),
  ])

  const bookings = (bookingsRes.data ?? []) as Array<{ id: string; status: string; created_at: string }>
  const pending = bookings.filter((b) => b.status === 'pending').length
  const confirmed = bookings.filter((b) => b.status === 'confirmed').length
  const today = new Date().toISOString().split('T')[0]
  const todayCount = bookings.filter((b) => b.created_at?.startsWith(today)).length

  return {
    totalBookings: bookingsRes.count ?? 0,
    pendingBookings: pending,
    confirmedBookings: confirmed,
    todayBookings: todayCount,
    totalServices: servicesRes.count ?? 0,
    totalDoctors: doctorsRes.count ?? 0,
    totalContacts: contactRes.count ?? 0,
    tablesMissing: false,
  }
}

async function getRecentBookings() {
  const supabase = tryCreateAdminClient()
  if (!supabase) return []

  const probe = await supabase.from('bookings').select('id').limit(1)
  if (isMissingTableError(probe.error)) return []

  const { data } = await supabase
    .from('bookings')
    .select('*, services(name), doctors(name)')
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
}

export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([getStats(), getRecentBookings()])
  const isEmpty =
    stats.tablesMissing ||
    (stats.totalBookings === 0 && stats.totalServices === 0 && stats.totalDoctors === 0)

  const statCards = [
    { label: 'Total bookings', value: stats.totalBookings, icon: '📅', accent: '' },
    { label: 'Pending', value: stats.pendingBookings, icon: '⏳', accent: 'warning' },
    { label: 'Confirmed', value: stats.confirmedBookings, icon: '✅', accent: 'success' },
    { label: 'Today', value: stats.todayBookings, icon: '🗓️', accent: 'info' },
    { label: 'Services', value: stats.totalServices, icon: '🦷', accent: 'purple' },
    { label: 'Doctors', value: stats.totalDoctors, icon: '👨‍⚕️', accent: 'pink' },
    { label: 'Contact forms', value: stats.totalContacts, icon: '📬', accent: 'orange' },
  ]

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <p className="admin-page-sub">
        Manage bookings, services, doctors, and what visitors see on the public site.
      </p>

      <AdminSeedButton show={isEmpty} />

      <div className="admin-stats">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="admin-stat-card"
            data-accent={card.accent || undefined}
          >
            <div className="admin-stat-icon">{card.icon}</div>
            <div className="admin-stat-value">{card.value}</div>
            <div className="admin-stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Recent bookings</h2>
          <Link href="/admin/bookings" className="admin-btn admin-btn-ghost">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">📅</div>
            <p>No bookings yet. Load sample data or create one from the public booking form.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {['Patient', 'Service', 'Doctor', 'Date & time', 'Status'].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((b: Record<string, unknown>) => (
                  <tr key={String(b.id)}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{String(b.patient_name)}</div>
                      <div style={{ color: 'var(--adm-muted)', fontSize: 12 }}>
                        {String(b.patient_email)}
                      </div>
                    </td>
                    <td>{(b.services as Record<string, string> | null)?.name ?? String(b.service_name ?? '—')}</td>
                    <td>{(b.doctors as Record<string, string> | null)?.name ?? String(b.doctor_name ?? '—')}</td>
                    <td>
                      {String(b.appointment_date)} {String(b.appointment_time)}
                    </td>
                    <td>
                      <span className={`admin-badge admin-badge-${String(b.status)}`}>
                        {String(b.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
