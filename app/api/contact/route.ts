import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import type { ContactRequest } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequest = await request.json()
    const { name, email, phone, message } = body

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Basic message length validation
    if (message.length > 2000) {
      return NextResponse.json({ error: 'Message is too long (max 2000 characters)' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        message: message.trim(),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(
      { submission: data, message: 'Thank you! We will contact you soon.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/contact error:', error)
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 })
  }
}
