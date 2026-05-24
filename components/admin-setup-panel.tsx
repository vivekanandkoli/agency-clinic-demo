'use client'

import { useState } from 'react'

type Props = {
  variant?: 'login' | 'dashboard'
}

export default function AdminSetupPanel({ variant = 'dashboard' }: Props) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loginHint, setLoginHint] = useState<string | null>(null)

  const runSetup = async () => {
    setLoading(true)
    setMessage(null)
    setError(null)
    setLoginHint(null)
    try {
      const endpoint = variant === 'login' ? '/api/setup' : '/api/admin/setup'
      const res = await fetch(endpoint, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Setup failed')
      setMessage(data.message || 'Database ready.')
      if (data.adminLogin?.password) {
        setLoginHint(
          `Sign in with ${data.adminLogin.email} and password: ${data.adminLogin.password}`
        )
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Setup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-alert admin-alert-warning" style={{ marginBottom: variant === 'login' ? 20 : 20 }}>
      <p style={{ margin: '0 0 8px', fontWeight: 600 }}>First-time database setup</p>
      <p style={{ margin: '0 0 12px', fontSize: 14 }}>
        Your Supabase project has no tables yet. Add{' '}
        <code>SUPABASE_DB_PASSWORD</code> to <code>.env.local</code>, restart the dev server, then
        run setup once.
      </p>
      <button
        type="button"
        className="admin-btn admin-btn-primary"
        onClick={runSetup}
        disabled={loading}
        style={variant === 'login' ? { width: '100%' } : undefined}
      >
        {loading ? 'Setting up…' : 'Set up database & admin user'}
      </button>
      {message && (
        <p style={{ margin: '12px 0 0', color: 'var(--adm-success)', fontSize: 13 }}>{message}</p>
      )}
      {loginHint && (
        <p style={{ margin: '8px 0 0', color: 'var(--adm-primary)', fontSize: 13, fontWeight: 600 }}>
          {loginHint}
        </p>
      )}
      {error && (
        <p style={{ margin: '8px 0 0', color: 'var(--adm-danger)', fontSize: 13 }}>{error}</p>
      )}
    </div>
  )
}
