'use client'

import { useState } from 'react'
import type { Doctor } from '@/lib/types'

export default function DoctorsManager({ initialDoctors }: { initialDoctors: Doctor[] }) {
  const [doctors, setDoctors] = useState(initialDoctors)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editData, setEditData] = useState<Partial<Doctor>>({})

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
    try {
      const res = await fetch('/api/admin/doctors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing, ...editData }),
      })
      if (res.ok) {
        const { doctor } = await res.json()
        setDoctors((prev) => prev.map((d) => (d.id === editing ? doctor : d)))
        cancelEdit()
      }
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (doctor: Doctor) => {
    const res = await fetch('/api/admin/doctors', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: doctor.id, is_active: !doctor.is_active }),
    })
    if (res.ok) {
      setDoctors((prev) =>
        prev.map((d) => (d.id === doctor.id ? { ...d, is_active: !d.is_active } : d))
      )
    }
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 20,
      }}
    >
      {doctors.length === 0 ? (
        <div
          style={{
            gridColumn: '1 / -1',
            background: 'white',
            borderRadius: 12,
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--light)',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍⚕️</div>
          <div>No doctors found. Run the seed migration in Supabase.</div>
        </div>
      ) : (
        doctors.map((doctor) => (
          <div
            key={doctor.id}
            style={{
              background: 'white',
              borderRadius: 12,
              padding: 24,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              opacity: doctor.is_active ? 1 : 0.6,
              border: editing === doctor.id ? '2px solid var(--primary)' : '2px solid transparent',
              transition: 'border-color 0.2s',
            }}
          >
            {editing === doctor.id ? (
              /* Edit Mode */
              <div style={{ display: 'grid', gap: 12 }}>
                <h3 style={{ fontWeight: 600, marginBottom: 4 }}>Editing: {doctor.name}</h3>
                <div>
                  <label style={labelStyle}>Name</label>
                  <input
                    value={editData.name ?? ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Specialty</label>
                  <input
                    value={editData.specialty ?? ''}
                    onChange={(e) => setEditData({ ...editData, specialty: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Bio</label>
                  <textarea
                    value={editData.bio ?? ''}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Image URL</label>
                  <input
                    value={editData.image_url ?? ''}
                    onChange={(e) => setEditData({ ...editData, image_url: e.target.value })}
                    style={inputStyle}
                    placeholder="https://..."
                  />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={saveEdit}
                    disabled={saving}
                    style={{
                      padding: '8px 20px',
                      background: 'var(--primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      padding: '8px 20px',
                      background: 'white',
                      color: 'var(--mid)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View Mode */
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  {doctor.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={doctor.image_url}
                      alt={doctor.name}
                      style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: '#e0f5ee',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                      }}
                    >
                      👨‍⚕️
                    </div>
                  )}
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{doctor.name}</div>
                    {doctor.specialty && (
                      <div style={{ color: 'var(--primary)', fontSize: 13, fontWeight: 500 }}>
                        {doctor.specialty}
                      </div>
                    )}
                    {!doctor.is_active && (
                      <span
                        style={{
                          display: 'inline-block',
                          marginTop: 4,
                          fontSize: 11,
                          background: '#fee2e2',
                          color: '#EF4444',
                          padding: '2px 8px',
                          borderRadius: 10,
                          fontWeight: 600,
                        }}
                      >
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                {doctor.bio && (
                  <p style={{ color: 'var(--mid)', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
                    {doctor.bio}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => startEdit(doctor)} style={actionBtnStyle}>
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => toggleActive(doctor)}
                    style={{
                      ...actionBtnStyle,
                      color: doctor.is_active ? '#EF4444' : '#22C55E',
                    }}
                  >
                    {doctor.is_active ? '🔒 Disable' : '✅ Enable'}
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--mid)',
  display: 'block',
  marginBottom: 4,
  fontWeight: 500,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
}

const actionBtnStyle: React.CSSProperties = {
  padding: '6px 14px',
  background: 'white',
  border: '1px solid var(--border)',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--mid)',
}
