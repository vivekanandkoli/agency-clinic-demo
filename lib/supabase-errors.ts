import type { PostgrestError } from '@supabase/supabase-js'

export function isMissingTableError(error: PostgrestError | null | undefined): boolean {
  if (!error) return false
  return (
    error.code === 'PGRST205' ||
    error.message?.includes('Could not find the table') === true
  )
}

export const MISSING_TABLES_MESSAGE =
  'Database tables are missing. Open the admin dashboard and click “Set up database”, or run the SQL in supabase/apply-all.sql in the Supabase SQL Editor.'
