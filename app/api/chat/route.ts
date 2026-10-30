import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/server'
import type { ChatRequest } from '@/lib/types'

const SYSTEM_PROMPT = `You are a friendly dental clinic assistant for Smile Bangkok Dental (คลินิกทันตกรรมสไมล์ บางกอก) in Bangkok, Thailand.

Key clinic info:
- Address: 123 Sukhumvit Road (demo address), Khlong Toei, Bangkok 10110
- Phone: 02-000-0000
- LINE ID: @smilebkk.demo
- Email: hello@smilebangkok-demo.example
- Hours: Open daily, closes 8:00 PM
- Google Rating: 4.9 stars, 2,400+ patients

Services: Teeth whitening (ฟอกสีฟัน), Orthodontics/braces (จัดฟัน), Invisalign, Dental implants (รากฟันเทียม), General dentistry, Crowns/bridges/veneers, Periodontics, Oral surgery, Root canal.

Doctors: Dr. Anan (Implants & Prosthodontics, 15+ years), Dr. Kanya (Orthodontics & Invisalign Diamond Provider), Dr. Somchai (Endodontics & Root Canal). All trained at top Thai universities.

For booking: Encourage them to click the "Book Appointment" button on the website, or contact via LINE @smilebkk.demo or call 02-000-0000.

Respond in the same language the user writes in. If Thai, reply in Thai. If English, reply in English. Keep replies concise and friendly. Max 3-4 sentences per reply. Use occasional emoji. Never make up prices — say "Please call us for pricing" or "ราคาขึ้นอยู่กับการตรวจ".`

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { message, session_id, history } = body

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { reply: 'Chat is currently unavailable. Please call us at 02-000-0000 or contact via LINE: @smilebkk.demo' },
        { status: 200 }
      )
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    // Build messages array — use history but cap at last 10 exchanges to save tokens
    const recentHistory = history.slice(-20)

    const response = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5',
      max_tokens: 400,
      // Short FAQ replies: skip thinking so it can't eat the token budget or delay the reply
      // (Haiku 5.5 thinks by default; disabling is allowed at its default effort).
      thinking: { type: 'disabled' },
      system: SYSTEM_PROMPT,
      messages: recentHistory
        .filter((m) => m.content?.trim())
        .map((m) => ({
          role: m.role,
          content: m.content,
        })),
    })

    // Content can include non-text blocks, so find the text rather than assuming content[0].
    const text = response.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('')
      .trim()
    // Never return an empty reply: it would be sent back as history and make every later request fail.
    const reply =
      text ||
      'Sorry, I can’t help with that here. Please call us at 02-000-0000 or message us on LINE: @smilebkk.demo'

    // Persist session to Supabase (non-blocking, best-effort)
    try {
      const supabase = createAdminClient()
      const allMessages = [
        ...recentHistory,
        { role: 'assistant' as const, content: reply },
      ]
      const { error: saveError } = await supabase.from('chat_sessions').upsert(
        {
          session_id,
          messages: allMessages,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'session_id' }
      )
      if (saveError) console.error('Chat session save failed:', saveError.message)
    } catch {
      // Non-critical — don't fail the response
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { reply: "Sorry, I'm experiencing technical difficulties. Please call us at 02-000-0000 or chat via LINE: @smilebkk.demo" },
      { status: 200 }
    )
  }
}
