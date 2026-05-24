import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/auth/require-admin-api'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const auth = await requireAdminApi()
  if (auth.error) return auth.error

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('name')

    if (error) throw error
    return NextResponse.json({ services: data })
  } catch (error) {
    console.error('GET /api/admin/services error:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdminApi()
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ service: data })
  } catch (error) {
    console.error('PUT /api/admin/services error:', error)
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
  }
}
