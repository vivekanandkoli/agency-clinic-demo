import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminConfigError, isAdminUser } from '@/lib/auth/admin'

export async function requireAdminApi() {
  const configError = getAdminConfigError()
  if (configError) {
    return { error: NextResponse.json({ error: configError }, { status: 503 }) }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  if (!isAdminUser(user)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { user }
}
