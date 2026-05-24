'use client'

import { useState } from 'react'
import type { ClinicSettings, HeroSettings, StatsSettings } from '@/lib/site-settings'

type Props = {
  initial: {
    clinic: ClinicSettings
    hero: HeroSettings
    stats: StatsSettings
  }
}

export default function SettingsForm({ initial }: Props) {
  const [clinic, setClinic] = useState(initial.clinic)
  const [hero, setHero] = useState(initial.hero)
  const [stats, setStats] = useState(initial.stats)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const save = async (key: 'clinic' | 'hero' | 'stats', value: Record<string, unknown>) => {
    setSaving(key)
    setMessage(null)
    setError(null)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      setMessage(`${key} settings saved. Changes appear on the public site.`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {message && <div className="admin-alert admin-alert-success">{message}</div>}
      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      <section className="admin-card">
        <div className="admin-card-header">
          <h2>Clinic info</h2>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            disabled={saving === 'clinic'}
            onClick={() => save('clinic', clinic as unknown as Record<string, unknown>)}
          >
            {saving === 'clinic' ? 'Saving…' : 'Save'}
          </button>
        </div>
        <div className="admin-card-body admin-grid-2">
          <Field label="Clinic name" value={clinic.name} onChange={(v) => setClinic({ ...clinic, name: v })} />
          <Field label="Name (Thai)" value={clinic.name_th} onChange={(v) => setClinic({ ...clinic, name_th: v })} />
          <Field label="Phone" value={clinic.phone} onChange={(v) => setClinic({ ...clinic, phone: v })} />
          <Field label="Email" value={clinic.email} onChange={(v) => setClinic({ ...clinic, email: v })} />
          <Field label="LINE ID" value={clinic.line} onChange={(v) => setClinic({ ...clinic, line: v })} />
          <Field label="Hours" value={clinic.hours} onChange={(v) => setClinic({ ...clinic, hours: v })} />
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label className="admin-label">Address</label>
            <textarea
              className="admin-textarea"
              rows={2}
              value={clinic.address}
              onChange={(e) => setClinic({ ...clinic, address: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <h2>Hero section</h2>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            disabled={saving === 'hero'}
            onClick={() => save('hero', hero as unknown as Record<string, unknown>)}
          >
            {saving === 'hero' ? 'Saving…' : 'Save'}
          </button>
        </div>
        <div className="admin-card-body admin-grid-2">
          <Field label="Badge" value={hero.badge} onChange={(v) => setHero({ ...hero, badge: v })} />
          <Field label="Rating" value={hero.rating} onChange={(v) => setHero({ ...hero, rating: v })} />
          <Field label="Headline" value={hero.title} onChange={(v) => setHero({ ...hero, title: v })} />
          <Field label="Headline (Thai)" value={hero.title_th} onChange={(v) => setHero({ ...hero, title_th: v })} />
          <Field label="Review count text" value={hero.review_count} onChange={(v) => setHero({ ...hero, review_count: v })} />
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label className="admin-label">Subtitle</label>
            <textarea className="admin-textarea" rows={2} value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} />
          </div>
          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label className="admin-label">Subtitle (Thai)</label>
            <textarea className="admin-textarea" rows={2} value={hero.subtitle_th} onChange={(e) => setHero({ ...hero, subtitle_th: e.target.value })} />
          </div>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card-header">
          <h2>Stats bar</h2>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            disabled={saving === 'stats'}
            onClick={() => save('stats', stats as unknown as Record<string, unknown>)}
          >
            {saving === 'stats' ? 'Saving…' : 'Save'}
          </button>
        </div>
        <div className="admin-card-body admin-grid-2">
          <Field label="Years of excellence" value={String(stats.years)} onChange={(v) => setStats({ ...stats, years: Number(v) || 0 })} />
          <Field label="Happy patients" value={String(stats.patients)} onChange={(v) => setStats({ ...stats, patients: Number(v) || 0 })} />
          <Field label="Google rating" value={String(stats.rating)} onChange={(v) => setStats({ ...stats, rating: Number(v) || 0 })} />
          <Field label="Open days per week" value={String(stats.open_days)} onChange={(v) => setStats({ ...stats, open_days: Number(v) || 0 })} />
        </div>
        <p style={{ padding: '0 22px 18px', margin: 0, fontSize: 13, color: 'var(--adm-muted)' }}>
          Doctor count on the homepage still comes from active doctors in the database.
        </p>
      </section>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="admin-field">
      <label className="admin-label">{label}</label>
      <input className="admin-input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
