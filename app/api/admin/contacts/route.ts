import { NextResponse } from 'next/server'
import { tryCreateAdminClient } from '@/lib/admin-db'
import { requireAdminApi } from '@/lib/auth/require-admin-api'

export async function PATCH(request: Request) {
  const auth = await requireAdminApi()
  if (auth.error) return auth.error

  const supabase = tryCreateAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const body = await request.json()
  const { id, status } = body as { id?: string; status?: string }
  if (!id || !status || !['new', 'read', 'replied'].includes(status)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { error } = await supabase.from('contact_submissions').update({ status }).eq('id', id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
