import { NextResponse } from 'next/server'
import { tryCreateAdminClient } from '@/lib/admin-db'
import { requireAdminApi } from '@/lib/auth/require-admin-api'
import { seedDatabase } from '@/lib/seed-database'
import { isMissingTableError, MISSING_TABLES_MESSAGE } from '@/lib/supabase-errors'

export async function POST() {
  const auth = await requireAdminApi()
  if (auth.error) return auth.error

  const supabase = tryCreateAdminClient()
  if (!supabase) {
    return NextResponse.json(
      { error: 'Database not configured. Add SUPABASE_SECRET_KEY to .env.local.' },
      { status: 503 }
    )
  }

  const { error: probeError } = await supabase.from('services').select('id').limit(1)
  if (isMissingTableError(probeError)) {
    return NextResponse.json(
      { error: MISSING_TABLES_MESSAGE, needsSetup: true },
      { status: 400 }
    )
  }

  try {
    const message = await seedDatabase(supabase)
    return NextResponse.json({ ok: true, message })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Seed failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
