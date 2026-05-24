'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminSeedButton({ show }: { show: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loginHint, setLoginHint] = useState<string | null>(null)

  if (!show) return null

  const runSetup = async () => {
    setLoading(true)
    setMessage(null)
    setError(null)
    setLoginHint(null)
    try {
      const res = await fetch('/api/admin/setup', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Setup failed')
      }
      setMessage(data.message || 'Database ready.')
      if (data.adminLogin?.password) {
        setLoginHint(
          `New admin login: ${data.adminLogin.email} / ${data.adminLogin.password} — change this password in Supabase Auth after signing in.`
        )
      }
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Setup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-alert admin-alert-warning" style={{ marginBottom: 20 }}>
      <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Database not set up yet</p>
      <p style={{ margin: '0 0 12px' }}>
        Supabase has no tables yet, so the admin panel and public site cannot load data. Click below
        to create tables, sample content, and an admin login (if needed).
      </p>
      <p style={{ margin: '0 0 12px', fontSize: 13 }}>
        Requires <code>SUPABASE_DB_PASSWORD</code> in <code>.env.local</code> (Supabase → Project
        Settings → Database → database password). Restart <code>npm run dev</code> after adding it.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={runSetup}
          disabled={loading}
        >
          {loading ? 'Setting up…' : 'Set up database'}
        </button>
        {message && <span style={{ color: 'var(--adm-success)', fontWeight: 600 }}>{message}</span>}
        {error && <span style={{ color: 'var(--adm-danger)', fontWeight: 600 }}>{error}</span>}
      </div>
      {loginHint && (
        <p style={{ margin: '12px 0 0', fontSize: 13, color: 'var(--adm-primary)' }}>{loginHint}</p>
      )}
    </div>
  )
}
