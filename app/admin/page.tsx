export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'

async function getStats() {
  const supabase = createAdminClient()
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
  }
}

async function getRecentBookings() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('bookings')
    .select('*, services(name), doctors(name)')
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
}

export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([getStats(), getRecentBookings()])

  const statCards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: '📅', color: '#2C6E5A' },
    { label: 'Pending', value: stats.pendingBookings, icon: '⏳', color: '#F59E0B' },
    { label: 'Confirmed', value: stats.confirmedBookings, icon: '✅', color: '#22C55E' },
    { label: 'Today', value: stats.todayBookings, icon: '🗓️', color: '#3B82F6' },
    { label: 'Services', value: stats.totalServices, icon: '🦷', color: '#8B5CF6' },
    { label: 'Doctors', value: stats.totalDoctors, icon: '👨‍⚕️', color: '#EC4899' },
    { label: 'Contact Forms', value: stats.totalContacts, icon: '📬', color: '#F97316' },
  ]

  const statusColor: Record<string, string> = {
    pending: '#F59E0B',
    confirmed: '#22C55E',
    completed: '#6B7280',
    cancelled: '#EF4444',
  }

  return (
    <div>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: 'var(--mid)', marginBottom: 32 }}>
        Welcome back! Here&apos;s what&apos;s happening at Sound Dental Clinic.
      </p>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 20,
          marginBottom: 40,
        }}
      >
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: 'white',
              borderRadius: 12,
              padding: '24px 20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              borderTop: `4px solid ${card.color}`,
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{card.icon}</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: card.color, lineHeight: 1 }}>
              {card.value}
            </div>
            <div style={{ color: 'var(--mid)', fontSize: 13, marginTop: 4 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div
        style={{
          background: 'white',
          borderRadius: 12,
          padding: 28,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>Recent Bookings</h2>
          <Link
            href="/admin/bookings"
            style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: 14 }}
          >
            View all →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p style={{ color: 'var(--light)', textAlign: 'center', padding: '40px 0' }}>
            No bookings yet.
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                {['Patient', 'Service', 'Doctor', 'Date & Time', 'Status'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      color: 'var(--mid)',
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((b: Record<string, unknown>) => (
                <tr key={String(b.id)} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 500 }}>{String(b.patient_name)}</div>
                    <div style={{ color: 'var(--mid)', fontSize: 12 }}>{String(b.patient_email)}</div>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--mid)' }}>
                    {(b.services as Record<string, string> | null)?.name ?? '—'}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--mid)' }}>
                    {(b.doctors as Record<string, string> | null)?.name ?? '—'}
                  </td>
                  <td style={{ padding: '12px', color: 'var(--mid)' }}>
                    {String(b.appointment_date)} {String(b.appointment_time)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        background: `${statusColor[String(b.status)] ?? '#6B7280'}20`,
                        color: statusColor[String(b.status)] ?? '#6B7280',
                      }}
                    >
                      {String(b.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
