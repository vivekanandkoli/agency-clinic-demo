import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/auth/require-admin-api'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const auth = await requireAdminApi()
  if (auth.error) return auth.error

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('name')

    if (error) throw error
    return NextResponse.json({ doctors: data })
  } catch (error) {
    console.error('GET /api/admin/doctors error:', error)
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAdminApi()
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('doctors')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ doctor: data })
  } catch (error) {
    console.error('PUT /api/admin/doctors error:', error)
    return NextResponse.json({ error: 'Failed to update doctor' }, { status: 500 })
  }
}
