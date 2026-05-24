'use client'

import { useState } from 'react'
import { parseAdminJson } from '@/lib/admin-api-client'
import type { Service } from '@/lib/types'

export default function ServicesManager({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editData, setEditData] = useState<Partial<Service>>({})
  const [actionError, setActionError] = useState<string | null>(null)

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
    setActionError(null)
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing, ...editData }),
      })
      const data = await parseAdminJson<{ service: Service }>(res)
      if (data?.service) {
        setServices((prev) => prev.map((s) => (s.id === editing ? data.service : s)))
        cancelEdit()
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to save service')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (service: Service) => {
    setActionError(null)
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: service.id, is_active: !service.is_active }),
      })
      const data = await parseAdminJson<{ service: Service }>(res)
      if (data?.service) {
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, is_active: data.service.is_active } : s))
        )
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update service')
    }
  }

  return (
    <div>
      {actionError && (
        <div className="admin-alert admin-alert-error" role="alert">
          {actionError}
        </div>
      )}

      <div className="admin-card">
        {services.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">🦷</div>
            <p>No services found. Run database setup from the login page or dashboard.</p>
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className={`admin-list-item${service.is_active ? '' : ' is-muted'}`}
            >
              {editing === service.id ? (
                <div className="admin-stack" style={{ gap: 12 }}>
                  <div className="admin-grid-2">
                    <div className="admin-field">
                      <label className="admin-label">Name</label>
                      <input
                        className="admin-input"
                        value={editData.name ?? ''}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Thai name</label>
                      <input
                        className="admin-input"
                        value={editData.name_th ?? ''}
                        onChange={(e) => setEditData({ ...editData, name_th: e.target.value })}
                      />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Price range</label>
                      <input
                        className="admin-input"
                        value={editData.price_range ?? ''}
                        onChange={(e) => setEditData({ ...editData, price_range: e.target.value })}
                      />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Duration (minutes)</label>
                      <input
                        type="number"
                        className="admin-input"
                        value={editData.duration_minutes ?? ''}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            duration_minutes: parseInt(e.target.value, 10) || undefined,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Description</label>
                    <textarea
                      className="admin-textarea"
                      rows={3}
                      value={editData.description ?? ''}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="admin-entity-title">
                      {service.icon && <span>{service.icon}</span>}
                      <span>{service.name}</span>
                      {service.name_th && (
                        <span style={{ color: 'var(--adm-muted)', fontWeight: 400, fontSize: 14 }}>
                          / {service.name_th}
                        </span>
                      )}
                      {!service.is_active && (
                        <span className="admin-badge admin-badge-cancelled">Inactive</span>
                      )}
                    </div>
                    {service.description && <p className="admin-entity-meta">{service.description}</p>}
                    <div className="admin-entity-tags">
                      {service.price_range && <span>{service.price_range}</span>}
                      {service.duration_minutes != null && (
                        <span>{service.duration_minutes} min</span>
                      )}
                    </div>
                  </div>
                  <div className="admin-row-actions">
                    <button type="button" onClick={() => startEdit(service)} className="admin-btn admin-btn-secondary">
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleActive(service)}
                      className={`admin-btn ${service.is_active ? 'admin-btn-danger' : 'admin-btn-primary'}`}
                    >
                      {service.is_active ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
