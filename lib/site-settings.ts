import { createClient } from '@/lib/supabase/server'
import { tryCreateAdminClient } from '@/lib/admin-db'

export interface ClinicSettings {
  name: string
  name_th: string
  tagline: string
  phone: string
  email: string
  line: string
  address: string
  hours: string
}

export interface HeroSettings {
  badge: string
  title: string
  title_th: string
  subtitle: string
  subtitle_th: string
  rating: string
  review_count: string
}

export interface StatsSettings {
  years: number
  patients: number
  rating: number
  open_days: number
}

const DEFAULT_CLINIC: ClinicSettings = {
  name: 'Sound Dental Clinic',
  name_th: 'คลินิกทันตกรรมซาวด์',
  tagline: 'Premium Dental Care',
  phone: '099-793-5635',
  email: 'sound.dentalclinic@gmail.com',
  line: '@sound.dentalclinic',
  address: '994, 996, 998 Rama III Road, Yan Nawa, Bangkok 10120',
  hours: 'Open daily until 8:00 PM',
}

const DEFAULT_HERO: HeroSettings = {
  badge: 'Premium Dental Care',
  title: 'Your Smile Deserves Excellence',
  title_th: 'รอยยิ้มของคุณสมควรได้รับความเป็นเลิศ',
  subtitle: 'Modern dental care with a gentle, personalized approach.',
  subtitle_th: 'บริการทันตกรรมคุณภาพระดับพรีเมียม',
  rating: '4.9',
  review_count: '2,400+',
}

const DEFAULT_STATS: StatsSettings = {
  years: 15,
  patients: 2400,
  rating: 4.9,
  open_days: 7,
}

async function fetchSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle()
    if (error?.code === 'PGRST205') return fallback
    if (data?.value && typeof data.value === 'object') {
      return { ...fallback, ...(data.value as object) } as T
    }
  } catch {
    /* table may not exist yet */
  }
  return fallback
}

export async function getClinicSettings() {
  return fetchSetting('clinic', DEFAULT_CLINIC)
}

export async function getHeroSettings() {
  return fetchSetting('hero', DEFAULT_HERO)
}

export async function getStatsSettings() {
  return fetchSetting('stats', DEFAULT_STATS)
}

export async function getAllSiteSettings() {
  const admin = tryCreateAdminClient()
  if (!admin) {
    return { clinic: DEFAULT_CLINIC, hero: DEFAULT_HERO, stats: DEFAULT_STATS }
  }
  const { data, error } = await admin.from('site_settings').select('key, value')
  if (error?.code === 'PGRST205') {
    return { clinic: DEFAULT_CLINIC, hero: DEFAULT_HERO, stats: DEFAULT_STATS }
  }
  const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]))
  return {
    clinic: { ...DEFAULT_CLINIC, ...(map.clinic as object) },
    hero: { ...DEFAULT_HERO, ...(map.hero as object) },
    stats: { ...DEFAULT_STATS, ...(map.stats as object) },
  }
}

export async function upsertSiteSettings(
  key: 'clinic' | 'hero' | 'stats',
  value: Record<string, unknown>
) {
  const admin = tryCreateAdminClient()
  if (!admin) throw new Error('Database not configured')
  const { error } = await admin
    .from('site_settings')
    .upsert({ key, value }, { onConflict: 'key' })
  if (error) throw error
}
