import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase/server'
import { isUuid } from '@/lib/booking-utils'
import { getSupabasePublishableKey, getSupabaseUrl } from '@/lib/supabase/env'
import type { BookingRequest } from '@/lib/types'

function mapBookingError(error: unknown): { message: string; status: number } {
  const msg = error instanceof Error ? error.message : String(error)
  if (msg.includes('SUPABASE_NOT_CONFIGURED') || msg.includes('Missing')) {
    return {
      message: 'Booking is temporarily unavailable. Please call 099-793-5635 or message us on LINE.',
      status: 503,
    }
  }
  if (msg.includes('PGRST205') || msg.includes('does not exist')) {
    return {
      message: 'Online booking is not set up yet. Please contact the clinic directly.',
      status: 503,
    }
  }
  if (msg.includes('violates foreign key')) {
    return {
      message: 'Could not save booking. Please try again or contact the clinic.',
      status: 400,
    }
  }
  return { message: 'Failed to create booking. Please try again or call 099-793-5635.', status: 500 }
}

async function insertBooking(row: Record<string, unknown>) {
  try {
    const admin = createAdminClient()
    return admin.from('bookings').insert(row).select().single()
  } catch {
    const url = getSupabaseUrl()
    const key = getSupabasePublishableKey()
    if (!url || !key) throw new Error('SUPABASE_NOT_CONFIGURED')
    const pub = createClient(url, key)
    return pub.from('bookings').insert(row).select().single()
  }
}

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('bookings')
      .select(`*, services(name), doctors(name)`)
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
      service_name,
      doctor_id,
      doctor_name,
      appointment_date,
      appointment_time,
      notes,
    } = body

    if (!patient_name?.trim() || !patient_email?.trim() || !appointment_date || !appointment_time) {
      return NextResponse.json(
        { error: 'Please fill in your name, email, date, and time.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(patient_email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const row = {
      patient_name: patient_name.trim(),
      patient_email: patient_email.trim().toLowerCase(),
      patient_phone: patient_phone?.trim() || null,
      service_id: isUuid(service_id) ? service_id : null,
      service_name: service_name?.trim() || null,
      doctor_id: isUuid(doctor_id) ? doctor_id : null,
      doctor_name: doctor_name?.trim() || null,
      appointment_date,
      appointment_time,
      notes: notes?.trim() || null,
      status: 'pending',
    }

    const { data, error } = await insertBooking(row)
    if (error) throw error

    return NextResponse.json({ booking: data, message: 'Booking confirmed!' }, { status: 201 })
  } catch (error) {
    console.error('POST /api/bookings error:', error)
    const { message, status } = mapBookingError(error)
    return NextResponse.json({ error: message }, { status })
  }
}
