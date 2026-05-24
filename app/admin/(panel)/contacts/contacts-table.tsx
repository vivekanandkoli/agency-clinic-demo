'use client'

import { useState } from 'react'
import type { ContactSubmission } from '@/lib/types'
import { patchAdmin } from '@/lib/admin-api-client'

export default function ContactsTable({
  initialContacts,
}: {
  initialContacts: ContactSubmission[]
}) {
  const [contacts, setContacts] = useState(initialContacts)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const updateStatus = async (id: string, status: ContactSubmission['status']) => {
    setLoadingId(id)
    try {
      await patchAdmin(`/api/admin/contacts`, { id, status })
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Update failed')
    } finally {
      setLoadingId(null)
    }
  }

  if (contacts.length === 0) {
    return (
      <div className="admin-card">
        <div className="admin-empty">
          <div className="admin-empty-icon">📬</div>
          <p>No contact messages yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-card">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              {['From', 'Subject', 'Message', 'Date', 'Status', 'Actions'].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--adm-muted)' }}>{c.email}</div>
                  {c.phone && <div style={{ fontSize: 12, color: 'var(--adm-muted)' }}>{c.phone}</div>}
                </td>
                <td>{c.subject || '—'}</td>
                <td style={{ maxWidth: 280 }}>{c.message}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
                <td>
                  <span className={`admin-badge admin-badge-${c.status === 'new' ? 'new' : 'read'}`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  <select
                    className="admin-select"
                    style={{ width: 'auto', minWidth: 120 }}
                    value={c.status}
                    disabled={loadingId === c.id}
                    onChange={(e) =>
                      updateStatus(c.id, e.target.value as ContactSubmission['status'])
                    }
                  >
                    <option value="new">new</option>
                    <option value="read">read</option>
                    <option value="replied">replied</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
