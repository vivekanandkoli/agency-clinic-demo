import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabasePublishableKey, getSupabaseSecretKey, getSupabaseUrl } from '@/lib/supabase/env'

export async function createClient() {
  const cookieStore = await cookies()
  const url = getSupabaseUrl()
  const key = getSupabasePublishableKey()
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or publishable/anon key')
  }

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll from a Server Component — safe to ignore when middleware refreshes sessions
          }
        },
      },
    }
  )
}

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { isSupabaseConfigured } from '@/lib/auth/admin'

// Service-role client for admin operations (bypasses RLS)
export function createAdminClient() {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_NOT_CONFIGURED')
  }

  const secretKey = getSupabaseSecretKey()
  if (!secretKey) {
    throw new Error('SUPABASE_NOT_CONFIGURED')
  }

  return createSupabaseClient(
    getSupabaseUrl()!,
    secretKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
