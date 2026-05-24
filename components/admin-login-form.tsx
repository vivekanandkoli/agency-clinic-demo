'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getPublishableKeyConfigIssue } from '@/lib/supabase/env'

function mapAuthError(message: string, status?: number): string {
  const lower = message.toLowerCase()
  if (status === 401 || lower.includes('invalid api key') || lower.includes('invalid jwt')) {
    return 'Sign-in is unavailable right now. Check your environment configuration.'
  }
  if (lower.includes('invalid login credentials') || lower.includes('invalid credentials')) {
    return 'Incorrect email or password.'
  }
  if (lower.includes('email not confirmed')) {
    return 'Please confirm your email before signing in.'
  }
  return 'Could not sign in. Try again.'
}

export default function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/admin'
  const urlError = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const envIssue = getPublishableKeyConfigIssue()

  const errorMessage =
    envIssue ??
    error ??
    (urlError === 'forbidden'
      ? 'This account does not have admin access.'
      : urlError === 'auth'
        ? 'Sign-in failed. Try again.'
        : null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        setError(mapAuthError(signInError.message, signInError.status))
        return
      }

      router.push(next)
      router.refresh()
    } catch {
      setError('Could not reach the server. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="admin-login-form">
      {errorMessage && (
        <div className="admin-login-error" role="alert">
          {errorMessage}
        </div>
      )}
      <div className="admin-field">
        <label htmlFor="admin-email" className="admin-label">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="admin-input admin-login-input"
          placeholder="you@clinic.com"
        />
      </div>
      <div className="admin-field admin-login-field-last">
        <label htmlFor="admin-password" className="admin-label">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-input admin-login-input"
          placeholder="••••••••"
        />
      </div>
      <button type="submit" disabled={loading} className="admin-btn admin-btn-primary admin-login-submit">
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
