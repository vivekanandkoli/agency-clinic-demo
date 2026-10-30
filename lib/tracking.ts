/**
 * Ad attribution + conversion events.
 *
 * - captureAttribution(): call once per page load. Saves UTM tags and ad click IDs
 *   (gclid = Google Ads, fbclid = Meta) from the URL so they survive navigation.
 * - getAttribution(): attach to every booking / contact submission.
 * - trackEvent(): sends a conversion to GTM (dataLayer), GA4 (gtag) and Meta Pixel (fbq),
 *   whichever are installed. Safe to call when none are.
 */

export const ATTRIBUTION_FIELDS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
  'landing_page',
  'referrer',
] as const

export type AttributionField = (typeof ATTRIBUTION_FIELDS)[number]
export type Attribution = Partial<Record<AttributionField, string>>

const STORAGE_KEY = 'sbd_attribution'
const URL_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'] as const

function readStored(): Attribution {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Attribution) : {}
  } catch {
    return {}
  }
}

function writeStored(value: Attribution) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Private mode / blocked storage — attribution just won't persist across pages.
  }
}

/** Last-touch: a new ad click replaces the previous one; plain visits keep what's stored. */
export function captureAttribution() {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const fromUrl: Attribution = {}
  for (const key of URL_PARAMS) {
    const v = params.get(key)
    if (v) fromUrl[key] = v.slice(0, 255)
  }

  const hasAdParams = Object.keys(fromUrl).length > 0
  const stored = readStored()

  if (hasAdParams) {
    writeStored({
      ...fromUrl,
      landing_page: window.location.pathname.slice(0, 255),
      referrer: document.referrer.slice(0, 255) || undefined,
    })
  } else if (Object.keys(stored).length === 0) {
    // First visit without tags — keep landing page + referrer (organic / direct).
    writeStored({
      landing_page: window.location.pathname.slice(0, 255),
      referrer: document.referrer.slice(0, 255) || undefined,
    })
  }
}

export function getAttribution(): Attribution {
  if (typeof window === 'undefined') return {}
  return readStored()
}

/** Human-readable source for the admin panel. */
export function describeSource(a: Partial<Record<AttributionField, string | null>> | null | undefined): string {
  if (!a) return 'Direct'
  if (a.utm_source) return a.utm_campaign ? `${a.utm_source} / ${a.utm_campaign}` : a.utm_source
  if (a.gclid) return 'Google Ads'
  if (a.fbclid) return 'Meta (Facebook/IG)'
  if (a.referrer) {
    try {
      return new URL(a.referrer).hostname.replace(/^www\./, '')
    } catch {
      return 'Referral'
    }
  }
  return 'Direct'
}

type TrackWindow = Window & {
  dataLayer?: Record<string, unknown>[]
  gtag?: (...args: unknown[]) => void
  fbq?: (...args: unknown[]) => void
}

/** Our event name → Meta standard event. */
const META_EVENTS: Record<string, string> = {
  booking_submitted: 'Schedule',
  contact_submitted: 'Lead',
  line_click: 'Contact',
  phone_click: 'Contact',
}

export function trackEvent(name: keyof typeof META_EVENTS, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === 'undefined') return
  const w = window as TrackWindow
  try {
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({ event: name, ...params })
    // When GTM is installed, configure GA4/Meta tags inside GTM instead and leave the IDs below unset.
    w.gtag?.('event', name, params)
    w.fbq?.('track', META_EVENTS[name], params)
  } catch {
    // Never let tracking break the page.
  }
}
