/** Canonical clinic services (matches Supabase seed). */
export const CLINIC_SERVICES = [
  { slug: 'checkup', name: 'Dental Checkup' },
  { slug: 'whitening', name: 'Teeth Whitening' },
  { slug: 'invisalign', name: 'Invisalign' },
  { slug: 'implant', name: 'Dental Implant' },
  { slug: 'crown', name: 'Crown & Veneer' },
  { slug: 'emergency', name: 'Emergency Care' },
] as const

export type ClinicServiceSlug = (typeof CLINIC_SERVICES)[number]['slug']
