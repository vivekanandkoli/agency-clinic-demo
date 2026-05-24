import { NextResponse } from 'next/server'
import { tryCreateAdminClient } from '@/lib/admin-db'
import { isSupabaseConfigured } from '@/lib/auth/admin'
import { canRunDatabaseSetup, runDatabaseMigrations } from '@/lib/db-setup'
import { ensureAdminUser } from '@/lib/ensure-admin-user'
import { seedDatabase } from '@/lib/seed-database'
import { isMissingTableError } from '@/lib/supabase-errors'

/**
 * One-time public setup — only runs while the database has no tables yet.
 * Lets you bootstrap before the first admin login.
 */
export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Supabase is not configured in .env.local.' },
      { status: 503 }
    )
  }

  const supabase = tryCreateAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Server could not connect to Supabase.' }, { status: 503 })
  }

  const { error: probeError } = await supabase.from('services').select('id').limit(1)
  if (probeError && !isMissingTableError(probeError)) {
    return NextResponse.json({ error: probeError.message }, { status: 500 })
  }
  if (!probeError) {
    return NextResponse.json(
      { error: 'Database is already set up. Sign in at /admin/login instead.' },
      { status: 403 }
    )
  }

  if (!canRunDatabaseSetup()) {
    return NextResponse.json(
      {
        error:
          'Add SUPABASE_DB_PASSWORD to .env.local (Supabase → Project Settings → Database), restart npm run dev, then try again. Or run supabase/apply-all.sql in the SQL Editor.',
        needsManualSql: true,
      },
      { status: 400 }
    )
  }

  const steps: string[] = []

  try {
    await runDatabaseMigrations()
    steps.push('Created database tables')

    const admin = await ensureAdminUser(supabase)
    if (admin?.created) {
      steps.push(`Created admin ${admin.email}`)
    }

    const seedMessage = await seedDatabase(supabase)
    steps.push(seedMessage)

    return NextResponse.json({
      ok: true,
      message: steps.join('. '),
      adminLogin: admin?.created
        ? { email: admin.email, password: admin.password }
        : undefined,
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Setup failed' },
      { status: 500 }
    )
  }
}
