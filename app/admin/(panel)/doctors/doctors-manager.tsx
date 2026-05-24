'use client'

import { useState } from 'react'
import { parseAdminJson } from '@/lib/admin-api-client'
import type { Doctor } from '@/lib/types'

export default function DoctorsManager({ initialDoctors }: { initialDoctors: Doctor[] }) {
  const [doctors, setDoctors] = useState(initialDoctors)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editData, setEditData] = useState<Partial<Doctor>>({})
  const [actionError, setActionError] = useState<string | null>(null)

  const startEdit = (doctor: Doctor) => {
    setEditing(doctor.id)
    setEditData({ ...doctor })
  }

  const cancelEdit = () => {
    setEditing(null)
    setEditData({})
  }

  const saveEdit = async () => {
    if (!editing) return
    setSaving(true)
    setActionError(null)
    try {
      const res = await fetch('/api/admin/doctors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing, ...editData }),
      })
      const data = await parseAdminJson<{ doctor: Doctor }>(res)
      if (data?.doctor) {
        setDoctors((prev) => prev.map((d) => (d.id === editing ? data.doctor : d)))
        cancelEdit()
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to save doctor')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (doctor: Doctor) => {
    setActionError(null)
    try {
      const res = await fetch('/api/admin/doctors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: doctor.id, is_active: !doctor.is_active }),
      })
      const data = await parseAdminJson<{ doctor: Doctor }>(res)
      if (data?.doctor) {
        setDoctors((prev) =>
          prev.map((d) => (d.id === doctor.id ? { ...d, is_active: data.doctor.is_active } : d))
        )
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update doctor')
    }
  }

  return (
    <div>
      {actionError && (
        <div className="admin-alert admin-alert-error" role="alert">
          {actionError}
        </div>
      )}

      <div className="admin-doctor-grid">
        {doctors.length === 0 ? (
          <div className="admin-card" style={{ gridColumn: '1 / -1' }}>
            <div className="admin-empty">
              <div className="admin-empty-icon">👨‍⚕️</div>
              <p>No doctors found. Run database setup from the login page or dashboard.</p>
            </div>
          </div>
        ) : (
          doctors.map((doctor) => (
            <div
              key={doctor.id}
              className={`admin-doctor-card${editing === doctor.id ? ' is-editing' : ''}${doctor.is_active ? '' : ' is-muted'}`}
            >
              {editing === doctor.id ? (
                <div className="admin-stack" style={{ gap: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Editing {doctor.name}</h3>
                  <div className="admin-field">
                    <label className="admin-label">Name</label>
                    <input
                      className="admin-input"
                      value={editData.name ?? ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Specialty</label>
                    <input
                      className="admin-input"
                      value={editData.specialty ?? ''}
                      onChange={(e) => setEditData({ ...editData, specialty: e.target.value })}
                    />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Bio</label>
                    <textarea
                      className="admin-textarea"
                      rows={3}
                      value={editData.bio ?? ''}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Image URL</label>
                    <input
                      className="admin-input"
                      value={editData.image_url ?? ''}
                      onChange={(e) => setEditData({ ...editData, image_url: e.target.value })}
                      placeholder="https://…"
                    />
                  </div>
                  <div className="admin-form-actions">
                    <button
                      type="button"
                      onClick={saveEdit}
                      disabled={saving}
                      className="admin-btn admin-btn-primary"
                    >
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button type="button" onClick={cancelEdit} className="admin-btn admin-btn-secondary">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="admin-doctor-head">
                    {doctor.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={doctor.image_url} alt={doctor.name} className="admin-avatar-lg" />
                    ) : (
                      <div className="admin-avatar-lg is-placeholder">{doctor.initials}</div>
                    )}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>{doctor.name}</div>
                      {doctor.specialty && <div className="admin-specialty">{doctor.specialty}</div>}
                      {!doctor.is_active && (
                        <span className="admin-badge admin-badge-cancelled" style={{ marginTop: 6 }}>
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                  {doctor.bio && (
                    <p className="admin-entity-meta" style={{ marginBottom: 16 }}>
                      {doctor.bio}
                    </p>
                  )}
                  <div className="admin-row-actions">
                    <button type="button" onClick={() => startEdit(doctor)} className="admin-btn admin-btn-secondary">
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleActive(doctor)}
                      className={`admin-btn ${doctor.is_active ? 'admin-btn-danger' : 'admin-btn-primary'}`}
                    >
                      {doctor.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
