'use client'

import { useState, useRef, useEffect } from 'react'
import type { ChatMessage } from '@/lib/types'

const SYSTEM_PROMPT = `You are a friendly dental clinic assistant for Sound Dental Clinic (คลินิกทันตกรรมซาวด์) in Bangkok, Thailand.

Key clinic info:
- Address: 994, 996, 998 Rama III Road, Yan Nawa, Bangkok 10120
- Phone: 099-793-5635
- LINE ID: @sound.dentalclinic
- Email: sound.dentalclinic@gmail.com
- Hours: Open daily, closes 8:00 PM
- Google Rating: 4.9 stars, 2,400+ patients

Services: Teeth whitening (ฟอกสีฟัน), Orthodontics/braces (จัดฟัน), Invisalign, Dental implants (รากฟันเทียม), General dentistry, Crowns/bridges/veneers, Periodontics, Oral surgery, Root canal.

Doctors: Dr. Nattapong (Implants/Prosthodontics), Dr. Pimnara (Orthodontics/Invisalign), Dr. Kritsada (Endodontics/Root Canal). All trained at top Thai universities.

For booking: Tell them to click the "Book Appointment" button on the page, or contact via LINE @sound.dentalclinic or call 099-793-5635.

Respond in the same language the user writes in. If Thai, reply in Thai. If English, reply in English. Keep replies concise and friendly. Max 3-4 sentences per reply. Use occasional emoji. Never make up prices — say "Please call us for pricing" or "ราคาขึ้นอยู่กับการตรวจ".`

const QUICK_REPLIES = [
  { text: '📅 Book Appointment', action: 'I want to book an appointment' },
  { text: '🦷 Services', action: 'What are your services?' },
  { text: '📍 Location & Hours', action: 'What are your hours and location?' },
  { text: '💰 Pricing', action: 'How much does teeth whitening cost?' },
]

const SESSION_ID = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`

export default function ChatbotWidget() {
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'bot' | 'user'; id: number }>>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [quickRepliesShown, setQuickRepliesShown] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)
  const historyRef = useRef<ChatMessage[]>([])
  const idRef = useRef(0)

  useEffect(() => {
    // Show initial greeting after a delay
    setTimeout(() => {
      addMessage('สวัสดีค่ะ! Welcome to Sound Dental Clinic 🦷<br><br>How can I help you today? / วันนี้ให้ช่วยอะไรได้บ้างคะ?', 'bot')
      setQuickRepliesShown(true)
    }, 600)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addMessage = (text: string, sender: 'bot' | 'user') => {
    setMessages((prev) => [...prev, { text, sender, id: ++idRef.current }])
    setTimeout(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight
      }
    }, 50)
  }

  const getBotReply = async (userText: string) => {
    historyRef.current.push({ role: 'user', content: userText })
    setIsTyping(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          session_id: SESSION_ID,
          history: historyRef.current,
        }),
      })

      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      const reply: string = data.reply

      historyRef.current.push({ role: 'assistant', content: reply })
      setIsTyping(false)
      addMessage(reply, 'bot')
    } catch {
      setIsTyping(false)
      const isThaiMessage = /[\u0E00-\u0E7F]/.test(userText)
      addMessage(
        isThaiMessage
          ? 'ขออภัยค่ะ เกิดข้อผิดพลาดชั่วคราว กรุณาโทรหาเราที่ 099-793-5635 หรือแชทผ่าน LINE: @sound.dentalclinic ค่ะ'
          : "Sorry, I'm experiencing technical difficulties. Please call us at 099-793-5635 or chat via LINE: @sound.dentalclinic",
        'bot'
      )
    }
  }

  const sendMessage = async (text: string) => {
    if (!text.trim()) return
    setQuickRepliesShown(false)
    setInput('')
    addMessage(text, 'user')

    // Check for booking intent
    const bookingKeywords = ['book', 'appointment', 'schedule', 'นัด', 'จอง']
    const isBookingRequest = bookingKeywords.some((k) => text.toLowerCase().includes(k))
    if (isBookingRequest) {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        addMessage('Great! To book an appointment, click the <strong>Book Appointment</strong> button at the top of the page. 📅<br><br>Or contact us directly:<br>📞 099-793-5635<br>💬 LINE: @sound.dentalclinic', 'bot')
        document.dispatchEvent(new CustomEvent('openBookingModal'))
      }, 600)
      return
    }

    await getBotReply(text)
  }

  return (
    <div className="chatbot-wrapper" id="chatbot">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <div className="chatbot-avatar">🦷</div>
          <div className="chatbot-info">
            <div className="chatbot-name">Sound Dental Assistant</div>
            <div className="chatbot-status">
              <span className="status-dot"></span> Online
            </div>
          </div>
        </div>

        <div className="chatbot-messages" id="chatMessages" ref={messagesRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div
                className="message-bubble"
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            </div>
          ))}
          {quickRepliesShown && (
            <div className="quick-replies">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr.text}
                  className="qr-btn"
                  onClick={() => sendMessage(qr.action)}
                >
                  {qr.text}
                </button>
              ))}
            </div>
          )}
          {isTyping && (
            <div className="message bot" id="typingIndicator">
              <div className="message-bubble typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>

        <div className="chatbot-input-area">
          <input
            type="text"
            className="chat-input"
            id="chatInput"
            placeholder="Type a message... / พิมพ์ข้อความ..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                sendMessage(input)
              }
            }}
          />
          <button
            className="send-btn"
            id="sendBtn"
            onClick={() => sendMessage(input)}
            aria-label="Send"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
