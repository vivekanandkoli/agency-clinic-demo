/** Supabase public (browser-safe) key — publishable (new) or anon (legacy). */
export function getSupabasePublishableKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

/**
 * Supabase secret key for server-side admin operations (bypasses RLS).
 * New dashboard: Secret API keys (`sb_secret_...`). Legacy: service_role JWT.
 */
export function getSupabaseSecretKey(): string | undefined {
  return (
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL
}

export function isPlaceholderSupabaseValue(value: string): boolean {
  return (
    value.includes('your-project') ||
    value.includes('your-anon') ||
    value.includes('your-publishable') ||
    value.includes('your-secret') ||
    value.includes('your-service-role') ||
    value.endsWith('...') ||
    value.includes('sb_publishable_...') ||
    value.includes('sb_secret_...')
  )
}

/** Client-safe check for common .env mistakes shown on the login page. */
export function getPublishableKeyConfigIssue(): string | null {
  const key = getSupabasePublishableKey()
  const url = getSupabaseUrl()

  if (!url || !key) {
    return 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.'
  }
  if (isPlaceholderSupabaseValue(url) || isPlaceholderSupabaseValue(key)) {
    return 'Supabase URL or publishable key looks like a placeholder. Paste the full values from Supabase → Project Settings → API.'
  }
  if (key.startsWith('sb_secret_')) {
    return 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be the publishable key (sb_publishable_...), not the secret key.'
  }
  if (key.startsWith('eyJ') && key.length < 100) {
    return 'Publishable/anon key looks truncated. Copy the entire key from the dashboard.'
  }
  return null
}
