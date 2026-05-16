'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Submission failed')
      }

      setStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px 20px',
          background: '#f0faf6',
          borderRadius: 12,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: '#2C6E5A' }}>
          Message Received!
        </h3>
        <p style={{ color: '#666', marginBottom: 20 }}>
          Thank you! Our team will contact you within 24 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          style={{
            padding: '10px 24px',
            background: '#2C6E5A',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} id="contactForm">
      {status === 'error' && (
        <div
          style={{
            background: '#fee2e2',
            color: '#EF4444',
            padding: '12px 16px',
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          {errorMsg}
        </div>
      )}
      <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="form-group">
          <label className="form-label" htmlFor="contactName">Full Name *</label>
          <input
            id="contactName"
            type="text"
            className="form-input"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="contactEmail">Email *</label>
          <input
            id="contactEmail"
            type="email"
            className="form-input"
            placeholder="your@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="form-group" style={{ marginBottom: 16 }}>
        <label className="form-label" htmlFor="contactPhone">Phone Number</label>
        <input
          id="contactPhone"
          type="tel"
          className="form-input"
          placeholder="0xx-xxx-xxxx"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>
      <div className="form-group" style={{ marginBottom: 24 }}>
        <label className="form-label" htmlFor="contactMessage">Message *</label>
        <textarea
          id="contactMessage"
          className="form-input"
          placeholder="How can we help you?"
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
          style={{ resize: 'vertical' }}
        />
      </div>
      <button
        type="submit"
        className="btn-primary"
        disabled={status === 'loading'}
        style={{ width: '100%' }}
      >
        {status === 'loading' ? 'Sending…' : '📨 Send Message'}
      </button>
    </form>
  )
}
