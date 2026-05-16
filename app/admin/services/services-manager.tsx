'use client'

import { useState } from 'react'
import type { Service } from '@/lib/types'

export default function ServicesManager({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editData, setEditData] = useState<Partial<Service>>({})

  const startEdit = (service: Service) => {
    setEditing(service.id)
    setEditData({ ...service })
  }

  const cancelEdit = () => {
    setEditing(null)
    setEditData({})
  }

  const saveEdit = async () => {
    if (!editing) return
    setSaving(true)
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing, ...editData }),
      })
      if (res.ok) {
        const { service } = await res.json()
        setServices((prev) => prev.map((s) => (s.id === editing ? service : s)))
        cancelEdit()
      }
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (service: Service) => {
    const res = await fetch('/api/admin/services', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: service.id, is_active: !service.is_active }),
    })
    if (res.ok) {
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, is_active: !s.is_active } : s))
      )
    }
  }

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      {services.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--light)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🦷</div>
          <div>No services found. Run the seed migration in Supabase.</div>
        </div>
      ) : (
        services.map((service) => (
          <div
            key={service.id}
            style={{
              borderBottom: '1px solid var(--border)',
              padding: '20px 24px',
              opacity: service.is_active ? 1 : 0.5,
            }}
          >
            {editing === service.id ? (
              /* Edit Mode */
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--mid)', display: 'block', marginBottom: 4 }}>Name</label>
                    <input
                      value={editData.name ?? ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--mid)', display: 'block', marginBottom: 4 }}>Thai Name</label>
                    <input
                      value={editData.name_th ?? ''}
                      onChange={(e) => setEditData({ ...editData, name_th: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--mid)', display: 'block', marginBottom: 4 }}>Price Range</label>
                    <input
                      value={editData.price_range ?? ''}
                      onChange={(e) => setEditData({ ...editData, price_range: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--mid)', display: 'block', marginBottom: 4 }}>Duration (minutes)</label>
                    <input
                      type="number"
                      value={editData.duration_minutes ?? ''}
                      onChange={(e) => setEditData({ ...editData, duration_minutes: parseInt(e.target.value) || undefined })}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--mid)', display: 'block', marginBottom: 4 }}>Description</label>
                  <textarea
                    value={editData.description ?? ''}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    {service.icon && <span style={{ fontSize: 20 }}>{service.icon}</span>}
                    <span style={{ fontWeight: 600, fontSize: 16 }}>{service.name}</span>
                    {service.name_th && (
                      <span style={{ color: 'var(--mid)', fontSize: 14 }}>/ {service.name_th}</span>
                    )}
                    {!service.is_active && (
                      <span
                        style={{
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
                  {service.description && (
                    <p style={{ color: 'var(--mid)', fontSize: 14, marginBottom: 8 }}>{service.description}</p>
                  )}
                  <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--light)' }}>
                    {service.price_range && <span>💰 {service.price_range}</span>}
                    {service.duration_minutes && <span>⏱ {service.duration_minutes} min</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => startEdit(service)}
                    style={actionBtnStyle}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => toggleActive(service)}
                    style={{
                      ...actionBtnStyle,
                      color: service.is_active ? '#EF4444' : '#22C55E',
                    }}
                  >
                    {service.is_active ? '🔒 Disable' : '✅ Enable'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
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
