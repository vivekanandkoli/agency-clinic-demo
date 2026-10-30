import { ATTRIBUTION_FIELDS, type Attribution } from '@/lib/tracking'

/** Keep only known attribution keys, as short strings. Never trust the client. */
export function sanitizeAttribution(input: unknown): Attribution {
  if (!input || typeof input !== 'object') return {}
  const out: Attribution = {}
  for (const key of ATTRIBUTION_FIELDS) {
    const v = (input as Record<string, unknown>)[key]
    if (typeof v === 'string' && v.trim()) out[key] = v.trim().slice(0, 255)
  }
  return out
}

/** True when the insert failed only because migration 004 hasn't been applied yet. */
export function isMissingAttributionColumn(error: unknown): boolean {
  const msg =
    error && typeof error === 'object' && 'message' in error
      ? String((error as { message: unknown }).message)
      : String(error)
  return ATTRIBUTION_FIELDS.some((f) => msg.includes(f)) && /column|schema cache/i.test(msg)
}
