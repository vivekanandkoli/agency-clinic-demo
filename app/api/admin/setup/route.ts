import { NextResponse } from 'next/server'
import { tryCreateAdminClient } from '@/lib/admin-db'
import { requireAdminApi } from '@/lib/auth/require-admin-api'
import { canRunDatabaseSetup, runDatabaseMigrations } from '@/lib/db-setup'
import { ensureAdminUser } from '@/lib/ensure-admin-user'
import { seedDatabase } from '@/lib/seed-database'
import { isMissingTableError } from '@/lib/supabase-errors'

async function tablesExistViaApi() {
  const supabase = tryCreateAdminClient()
  if (!supabase) return false
  const { error } = await supabase.from('services').select('id').limit(1)
  if (!error) return true
  if (isMissingTableError(error)) return false
  throw new Error(error.message)
}

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

  const steps: string[] = []
  let adminLogin: { email: string; password?: string } | undefined

  try {
    let hasTables = await tablesExistViaApi()

    if (!hasTables) {
      if (!canRunDatabaseSetup()) {
        return NextResponse.json(
          {
            error:
              'Database tables do not exist yet. Either add SUPABASE_DB_PASSWORD to .env.local (Supabase → Project Settings → Database → database password) and click Set up again, or paste supabase/apply-all.sql into the Supabase SQL Editor.',
            needsManualSql: true,
          },
          { status: 400 }
        )
      }

      await runDatabaseMigrations()
      steps.push('Created database tables')
      hasTables = await tablesExistViaApi()
      if (!hasTables) {
        return NextResponse.json(
          { error: 'Migrations ran but services table is still missing. Check SUPABASE_DB_PASSWORD.' },
          { status: 500 }
        )
      }
    } else {
      steps.push('Database tables already exist')
    }

    const admin = await ensureAdminUser(supabase)
    if (admin) {
      if (admin.created) {
        steps.push(`Created admin user ${admin.email}`)
        adminLogin = { email: admin.email, password: admin.password }
      } else {
        steps.push(`Admin user ${admin.email} already exists`)
      }
    }

    const seedMessage = await seedDatabase(supabase)
    steps.push(seedMessage)

    return NextResponse.json({
      ok: true,
      message: steps.join('. '),
      adminLogin,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Setup failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
