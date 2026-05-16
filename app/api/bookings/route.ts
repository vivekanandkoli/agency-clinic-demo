import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import type { BookingRequest } from '@/lib/types'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services(name),
        doctors(name)
      `)
      .order('appointment_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ bookings: data })
  } catch (error) {
    console.error('GET /api/bookings error:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json()
    const {
      patient_name,
      patient_email,
      patient_phone,
      service_id,
      doctor_id,
      appointment_date,
      appointment_time,
      notes,
    } = body

    // Validate required fields
    if (!patient_name?.trim() || !patient_email?.trim() || !appointment_date || !appointment_time) {
      return NextResponse.json(
        { error: 'Missing required fields: patient_name, patient_email, appointment_date, appointment_time' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(patient_email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        patient_name: patient_name.trim(),
        patient_email: patient_email.trim().toLowerCase(),
        patient_phone: patient_phone?.trim() || null,
        service_id: service_id || null,
        doctor_id: doctor_id || null,
        appointment_date,
        appointment_time,
        notes: notes?.trim() || null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ booking: data, message: 'Booking confirmed!' }, { status: 201 })
  } catch (error) {
    console.error('POST /api/bookings error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
