'use client'

import { useState } from 'react'
import { parseAdminJson } from '@/lib/admin-api-client'
import type { Booking } from '@/lib/types'

type BookingWithRelations = Booking & {
  services: { name: string } | null
  doctors: { name: string } | null
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'] as const

export default function BookingsTable({ initialBookings }: { initialBookings: BookingWithRelations[] }) {
  const [bookings, setBookings] = useState(initialBookings)
  const [filter, setFilter] = useState<string>('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)

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
    setActionError(null)
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      const data = await parseAdminJson<{ booking: Booking }>(res)
      if (data?.booking) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === id
              ? { ...b, status: status as 'pending' | 'confirmed' | 'completed' | 'cancelled' }
              : b
          )
        )
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update booking')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div>
      {actionError && (
        <div className="admin-alert admin-alert-error" role="alert">
          {actionError}
        </div>
      )}

      <div className="admin-toolbar">
        <input
          type="search"
          placeholder="Search patient name, email, service…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-input admin-search-input"
        />
        <div className="admin-pills">
          {['all', ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`admin-pill${filter === s ? ' is-active' : ''}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card">
        {filteredBookings.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">📅</div>
            <p>No bookings found</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {['Patient', 'Contact', 'Service', 'Doctor', 'Date & time', 'Status', 'Notes'].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong>{b.patient_name}</strong>
                    </td>
                    <td>
                      <div>{b.patient_email}</div>
                      {b.patient_phone && (
                        <div style={{ fontSize: 12, color: 'var(--adm-muted)' }}>{b.patient_phone}</div>
                      )}
                    </td>
                    <td>{b.services?.name ?? '—'}</td>
                    <td>{b.doctors?.name ?? '—'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <div>{b.appointment_date}</div>
                      <div style={{ fontSize: 12, color: 'var(--adm-muted)' }}>{b.appointment_time}</div>
                    </td>
                    <td>
                      <select
                        value={b.status}
                        disabled={updating === b.id}
                        onChange={(e) => updateStatus(b.id, e.target.value)}
                        className="admin-status-select"
                        data-status={b.status}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ color: 'var(--adm-muted)', fontSize: 13, maxWidth: 200 }}>
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
