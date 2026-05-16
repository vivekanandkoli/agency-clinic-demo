'use client'

import { useState, useEffect } from 'react'
import type { Service, Doctor } from '@/lib/types'

interface BookingModalProps {
  services: Service[]
  doctors: Doctor[]
}

type Step = 'service' | 'doctor' | 'datetime' | 'details' | 'confirm' | 'success'

const TIME_SLOTS = [
  '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
]

export default function BookingModal({ services, doctors }: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<Step>('service')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [patientName, setPatientName] = useState('')
  const [patientEmail, setPatientEmail] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const handler = () => {
      setIsOpen(true)
      setStep('service')
      setError('')
    }
    document.addEventListener('openBookingModal', handler)
    return () => document.removeEventListener('openBookingModal', handler)
  }, [])

  const close = () => {
    setIsOpen(false)
    setStep('service')
    setError('')
  }

  const getMinDate = () => {
    const d = new Date()
    return d.toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 60)
    return d.toISOString().split('T')[0]
  }

  const submit = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: patientName,
          patient_email: patientEmail,
          patient_phone: patientPhone || undefined,
          service_id: selectedService?.id,
          service_name: selectedService?.name,
          doctor_id: selectedDoctor?.id !== 'any' ? selectedDoctor?.id : undefined,
          doctor_name: selectedDoctor?.name,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          notes: notes || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Booking failed. Please try again.')
      }
      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="booking-modal">
        {/* Header */}
        <div className="modal-header">
          <div>
            <div className="modal-title">Book Appointment</div>
            <div className="modal-subtitle">Sound Dental Clinic · Bangkok</div>
          </div>
          <button className="modal-close" onClick={close} aria-label="Close">✕</button>
        </div>

        {/* Steps */}
        {step !== 'success' && (
          <div className="booking-steps">
            {(['service', 'doctor', 'datetime', 'details', 'confirm'] as Step[]).map((s, i) => (
              <div
                key={s}
                className={`step ${step === s ? 'active' : ''} ${
                  ['service', 'doctor', 'datetime', 'details', 'confirm'].indexOf(step) > i ? 'completed' : ''
                }`}
              >
                <div className="step-dot">{['service', 'doctor', 'datetime', 'details', 'confirm'].indexOf(step) > i ? '✓' : i + 1}</div>
                <div className="step-label">{['Service', 'Doctor', 'Date & Time', 'Details', 'Confirm'][i]}</div>
              </div>
            ))}
          </div>
        )}

        {/* Step Content */}
        <div className="modal-body">
          {/* Step 1: Service */}
          {step === 'service' && (
            <div className="step-content">
              <h3 className="step-title">What do you need?</h3>
              <div className="service-options">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className={`service-option ${selectedService?.id === svc.id ? 'selected' : ''}`}
                    onClick={() => setSelectedService(svc)}
                  >
                    <span className="option-icon">{svc.icon}</span>
                    <div>
                      <div className="option-name">{svc.name}</div>
                      {svc.name_th && <div className="option-name-th">{svc.name_th}</div>}
                      {svc.price_range && <div className="option-price">{svc.price_range}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="btn-primary"
                onClick={() => setStep('doctor')}
                disabled={!selectedService}
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Doctor */}
          {step === 'doctor' && (
            <div className="step-content">
              <h3 className="step-title">Choose your doctor</h3>
              <div className="doctor-options">
                {doctors.map((doc) => (
                  <div
                    key={doc.id}
                    className={`doctor-option ${selectedDoctor?.id === doc.id ? 'selected' : ''}`}
                    onClick={() => setSelectedDoctor(doc)}
                  >
                    <div className="option-avatar">{doc.initials}</div>
                    <div>
                      <div className="option-name">{doc.name}</div>
                      <div className="option-specialty">{doc.specialty}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="step-actions">
                <button className="btn-secondary" onClick={() => setStep('service')}>← Back</button>
                <button className="btn-primary" onClick={() => setStep('datetime')} disabled={!selectedDoctor}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 'datetime' && (
            <div className="step-content">
              <h3 className="step-title">Pick a date &amp; time</h3>
              <div className="datetime-grid">
                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={selectedDate}
                    min={getMinDate()}
                    max={getMaxDate()}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                {selectedDate && (
                  <div className="form-group">
                    <label className="form-label">Preferred Time</label>
                    <div className="time-grid">
                      {TIME_SLOTS.map((t) => (
                        <button
                          key={t}
                          className={`time-slot ${selectedTime === t ? 'selected' : ''}`}
                          onClick={() => setSelectedTime(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="step-actions">
                <button className="btn-secondary" onClick={() => setStep('doctor')}>← Back</button>
                <button
                  className="btn-primary"
                  onClick={() => setStep('details')}
                  disabled={!selectedDate || !selectedTime}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Patient Details */}
          {step === 'details' && (
            <div className="step-content">
              <h3 className="step-title">Your details</h3>
              <div className="details-form">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. John Smith / สมชาย ใจดี"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="your@email.com"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="0XX-XXX-XXXX"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Notes (optional)</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Any special requests or dental concerns?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="step-actions">
                <button className="btn-secondary" onClick={() => setStep('datetime')}>← Back</button>
                <button
                  className="btn-primary"
                  onClick={() => setStep('confirm')}
                  disabled={!patientName || !patientEmail}
                >
                  Review →
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Confirm */}
          {step === 'confirm' && (
            <div className="step-content">
              <h3 className="step-title">Confirm your appointment</h3>
              <div className="confirm-summary">
                <div className="summary-row">
                  <span className="summary-label">Service</span>
                  <span className="summary-value">{selectedService?.icon} {selectedService?.name}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Doctor</span>
                  <span className="summary-value">{selectedDoctor?.name}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Date</span>
                  <span className="summary-value">{new Date(selectedDate + 'T00:00').toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Time</span>
                  <span className="summary-value">{selectedTime}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Name</span>
                  <span className="summary-value">{patientName}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Email</span>
                  <span className="summary-value">{patientEmail}</span>
                </div>
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="step-actions">
                <button className="btn-secondary" onClick={() => setStep('details')} disabled={isLoading}>← Back</button>
                <button className="btn-primary" onClick={submit} disabled={isLoading}>
                  {isLoading ? 'Saving…' : '✓ Confirm Booking'}
                </button>
              </div>
            </div>
          )}

          {/* Success */}
          {step === 'success' && (
            <div className="step-content success-content">
              <div className="success-icon">🎉</div>
              <h3 className="step-title">Booking Confirmed!</h3>
              <p>Thank you, <strong>{patientName}</strong>! Your appointment has been saved.</p>
              <p>
                <strong>{selectedService?.name}</strong> with <strong>{selectedDoctor?.name}</strong><br />
                {new Date(selectedDate + 'T00:00').toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {selectedTime}
              </p>
              <p style={{ marginTop: '1rem', color: 'var(--mid)', fontSize: '14px' }}>
                Our team will confirm your appointment via email at <strong>{patientEmail}</strong> within 1 business hour.
              </p>
              <p style={{ marginTop: '0.5rem', color: 'var(--mid)', fontSize: '14px' }}>
                Questions? Chat on LINE: <strong>@sound.dentalclinic</strong> or call <strong>099-793-5635</strong>
              </p>
              <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={close}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
