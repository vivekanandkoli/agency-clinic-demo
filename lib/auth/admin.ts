import type { User } from '@supabase/supabase-js'
import {
  getSupabasePublishableKey,
  getSupabaseSecretKey,
  getSupabaseUrl,
  isPlaceholderSupabaseValue,
} from '@/lib/supabase/env'

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? ''
  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminUser(user: User | null | undefined): boolean {
  if (!user?.email) return false
  const allowed = getAdminEmails()
  if (allowed.length === 0) return false
  return allowed.includes(user.email.toLowerCase())
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl()
  const publishable = getSupabasePublishableKey()
  const secret = getSupabaseSecretKey()
  if (!url || !publishable || !secret) return false
  if (
    isPlaceholderSupabaseValue(url) ||
    isPlaceholderSupabaseValue(publishable) ||
    isPlaceholderSupabaseValue(secret)
  ) {
    return false
  }
  return true
}

export function getAdminConfigError(): string | null {
  if (!isSupabaseConfigured()) {
    return 'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, and SUPABASE_SECRET_KEY (server-only) to .env.local.'
  }
  if (getAdminEmails().length === 0) {
    return 'No admin emails configured. Set ADMIN_EMAILS in .env.local (comma-separated) and create matching users in Supabase Auth.'
  }
  return null
}
