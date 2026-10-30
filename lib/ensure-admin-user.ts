import { randomBytes } from 'crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getAdminEmails } from '@/lib/auth/admin'

/** One-time random password, shown once by the setup screen when ADMIN_INITIAL_PASSWORD is not set. */
function generatePassword() {
  return randomBytes(12).toString('base64url')
}

export async function ensureAdminUser(supabase: SupabaseClient): Promise<{
  email: string
  created: boolean
  password?: string
} | null> {
  const emails = getAdminEmails()
  if (emails.length === 0) return null

  const email = emails[0]
  const password = process.env.ADMIN_INITIAL_PASSWORD || generatePassword()

  const { data: listData, error: listError } = await supabase.auth.admin.listUsers({
    perPage: 200,
  })
  if (listError) {
    throw new Error(`Could not list auth users: ${listError.message}`)
  }

  const exists = listData.users.some(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  )

  if (exists) {
    return { email, created: false }
  }

  const { error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (createError) {
    throw new Error(`Could not create admin user: ${createError.message}`)
  }

  return { email, created: true, password }
}
