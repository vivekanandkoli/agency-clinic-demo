'use client'

import { useState } from 'react'
import type { Booking } from '@/lib/types'

type BookingWithRelations = Booking & {
  services: { name: string } | null
  doctors: { name: string } | null
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#F59E0B',
  confirmed: '#22C55E',
  completed: '#6B7280',
  cancelled: '#EF4444',
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled']

export default function BookingsTable({ initialBookings }: { initialBookings: BookingWithRelations[] }) {
  const [bookings, setBookings] = useState(initialBookings)
  const [filter, setFilter] = useState<string>('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = filter === 'all' || b.status === filter
    const matchesSearch =
      search === '' ||
      b.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      b.patient_email.toLowerCase().includes(search.toLowerCase()) ||
      (b.services?.name ?? '').toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === id
              ? { ...b, status: status as 'pending' | 'confirmed' | 'completed' | 'cancelled' }
              : b
          )
        )
      }
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div>
      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 20,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          placeholder="Search patient name, email, service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '8px 16px',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 14,
            flex: '1 1 260px',
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: '1px solid var(--border)',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                background: filter === s ? 'var(--primary)' : 'white',
                color: filter === s ? 'white' : 'var(--mid)',
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: 'white',
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          overflow: 'hidden',
        }}
      >
        {filteredBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--light)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
            <div>No bookings found</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)', background: '#fafafa' }}>
                  {['Patient', 'Contact', 'Service', 'Doctor', 'Date & Time', 'Status', 'Notes'].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: 'left',
                        padding: '12px 16px',
                        color: 'var(--mid)',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr
                    key={b.id}
                    style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseOver={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = '#fafafa')
                    }
                    onMouseOut={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = 'white')
                    }
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600 }}>{b.patient_name}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--mid)' }}>
                      <div>{b.patient_email}</div>
                      {b.patient_phone && <div style={{ fontSize: 12 }}>{b.patient_phone}</div>}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--mid)' }}>
                      {b.services?.name ?? '—'}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--mid)' }}>
                      {b.doctors?.name ?? '—'}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--mid)', whiteSpace: 'nowrap' }}>
                      <div>{b.appointment_date}</div>
                      <div style={{ fontSize: 12 }}>{b.appointment_time}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <select
                        value={b.status}
                        disabled={updating === b.id}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 20,
                          border: `1.5px solid ${STATUS_COLORS[b.status] ?? '#6B7280'}`,
                          background: `${STATUS_COLORS[b.status] ?? '#6B7280'}15`,
                          color: STATUS_COLORS[b.status] ?? '#6B7280',
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          outline: 'none',
                        }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--mid)', fontSize: 13 }}>
                      {b.notes ?? '—'}
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
