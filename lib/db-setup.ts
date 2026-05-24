import { readFileSync } from 'fs'
import { join } from 'path'
import pg from 'pg'

const MIGRATION_FILES = [
  '001_initial_schema.sql',
  '002_seed_data.sql',
  '003_site_settings_and_samples.sql',
]

export function getDatabaseUrl(): string | null {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  }

  const password = process.env.SUPABASE_DB_PASSWORD
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!password || !projectUrl) return null

  const ref = projectUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
  if (!ref) return null

  return `postgresql://postgres:${encodeURIComponent(password)}@db.${ref}.supabase.co:5432/postgres`
}

export function canRunDatabaseSetup(): boolean {
  return getDatabaseUrl() !== null
}

export async function runDatabaseMigrations(): Promise<void> {
  const connectionString = getDatabaseUrl()
  if (!connectionString) {
    throw new Error(
      'Add SUPABASE_DB_PASSWORD (from Supabase → Project Settings → Database) or DATABASE_URL to .env.local, then restart the dev server.'
    )
  }

  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  })

  await client.connect()

  try {
    for (const file of MIGRATION_FILES) {
      const path = join(process.cwd(), 'supabase', 'migrations', file)
      const sql = readFileSync(path, 'utf8')
      await client.query(sql)
    }
  } finally {
    await client.end()
  }
}

export async function databaseTablesExist(): Promise<boolean> {
  const connectionString = getDatabaseUrl()
  if (!connectionString) return false

  const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    const result = await client.query(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'services'
      ) AS exists`
    )
    return Boolean(result.rows[0]?.exists)
  } catch {
    return false
  } finally {
    await client.end().catch(() => undefined)
  }
}
