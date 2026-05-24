import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/auth/require-admin-api'
import { getAllSiteSettings, upsertSiteSettings } from '@/lib/site-settings'

export async function GET() {
  const auth = await requireAdminApi()
  if (auth.error) return auth.error

  try {
    const settings = await getAllSiteSettings()
    return NextResponse.json(settings)
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to load settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const auth = await requireAdminApi()
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { key, value } = body as { key?: string; value?: Record<string, unknown> }
    if (!key || !value || !['clinic', 'hero', 'stats'].includes(key)) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 400 })
    }
    await upsertSiteSettings(key as 'clinic' | 'hero' | 'stats', value)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to save settings' },
      { status: 500 }
    )
  }
}
