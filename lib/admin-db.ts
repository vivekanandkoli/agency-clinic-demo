import { isSupabaseConfigured } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'

export function tryCreateAdminClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null
  try {
    return createAdminClient()
  } catch {
    return null
  }
}
