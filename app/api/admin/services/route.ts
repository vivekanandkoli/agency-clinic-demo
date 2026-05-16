import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
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
