import { createBrowserClient } from '@supabase/ssr'
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
  isLoopbackSupabaseUrl,
  SUPABASE_AUTH_PROXY_PATH,
} from '@/lib/supabase/env'

export function createClient() {
  const url = getSupabaseUrl()
  const key = getSupabasePublishableKey()
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or publishable/anon key')
  }
  if (!isLoopbackSupabaseUrl(url)) {
    return createBrowserClient(url, key)
  }
  // Supabase on this machine (Docker) is unreachable from visitors' browsers when the site is
  // shared through a tunnel, so go through the site's own /supabase-auth rewrite instead.
  // Keep the cookie name the server derives from the real URL, or the server won't see the session.
  return createBrowserClient(`${window.location.origin}${SUPABASE_AUTH_PROXY_PATH}`, key, {
    cookieOptions: { name: `sb-${new URL(url).hostname.split('.')[0]}-auth-token` },
  })
}
