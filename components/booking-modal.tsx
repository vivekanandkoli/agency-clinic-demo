'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Service, Doctor } from '@/lib/types'

interface BookingModalProps {
  services: Service[]
  doctors: Doctor[]
}

const STEPS = ['service', 'doctor', 'datetime', 'details', 'confirm'] as const
type Step = (typeof STEPS)[number] | 'success'

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

  const resetForm = useCallback(() => {
    setStep('service')
    setError('')
    setSelectedService(null)
    setSelectedDoctor(null)
    setSelectedDate('')
    setSelectedTime('')
    setPatientName('')
    setPatientEmail('')
    setPatientPhone('')
    setNotes('')
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    resetForm()
  }, [resetForm])

  useEffect(() => {
    const open = () => {
      setIsOpen(true)
      resetForm()
    }
    document.addEventListener('openBookingModal', open)
    return () => document.removeEventListener('openBookingModal', open)
  }, [resetForm])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  const stepIndex = step === 'success' ? STEPS.length : STEPS.indexOf(step as (typeof STEPS)[number])

  const getMinDate = () => new Date().toISOString().split('T')[0]

  const getMaxDate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 60)
    return d.toISOString().split('T')[0]
  }

  const canContinue = () => {
    if (step === 'service') return !!selectedService
    if (step === 'doctor') return !!selectedDoctor
    if (step === 'datetime') return !!selectedDate && !!selectedTime
    if (step === 'details') return !!patientName.trim() && !!patientEmail.trim()
    return true
  }

  const goNext = () => {
    if (step === 'service') setStep('doctor')
    else if (step === 'doctor') setStep('datetime')
    else if (step === 'datetime') setStep('details')
    else if (step === 'details') setStep('confirm')
  }

  const goBack = () => {
    if (step === 'doctor') setStep('service')
    else if (step === 'datetime') setStep('doctor')
    else if (step === 'details') setStep('datetime')
    else if (step === 'confirm') setStep('details')
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
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
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

  const formattedDate = selectedDate
    ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <div
      className="booking-overlay active"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="booking-modal">
        <header className="booking-header">
          <div className="booking-header-content">
            <h2 id="booking-title">Book Appointment</h2>
            <p>Sound Dental Clinic · Bangkok</p>
          </div>
          <button type="button" className="booking-close" onClick={close} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {step !== 'success' && (
          <div className="booking-progress" aria-label="Booking progress">
            {STEPS.map((s, i) => (
              <span key={s} style={{ display: 'contents' }}>
                <span className="progress-step">
                  <span
                    className={`progress-dot${step === s ? ' active' : ''}${
                      stepIndex > i ? ' completed' : ''
                    }`}
                  >
                    <span>{i + 1}</span>
                  </span>
                </span>
                {i < STEPS.length - 1 && (
                  <span className={`progress-line${stepIndex > i ? ' completed' : ''}`} />
                )}
              </span>
            ))}
          </div>
        )}

        <div className="booking-body">
          {/* Service */}
          <div className={`booking-step${step === 'service' ? ' active' : ''}`}>
            <h3 className="step-title">What do you need?</h3>
            <p className="step-subtitle">Choose a treatment to get started</p>
            {services.length === 0 ? (
              <p className="booking-empty">No services available. Please contact the clinic.</p>
            ) : (
              <div className="service-options">
                {services.map((svc) => (
                  <button
                    key={svc.id}
                    type="button"
                    className={`service-option${selectedService?.id === svc.id ? ' selected' : ''}`}
                    onClick={() => setSelectedService(svc)}
                  >
                    <span className="service-option-icon">{svc.icon}</span>
                    <span className="service-option-name">{svc.name}</span>
                    {svc.name_th && <span className="service-option-name-th">{svc.name_th}</span>}
                    {svc.price_range && <span className="service-option-price">{svc.price_range}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Doctor */}
          <div className={`booking-step${step === 'doctor' ? ' active' : ''}`}>
            <h3 className="step-title">Choose your doctor</h3>
            <p className="step-subtitle">Or pick the first available specialist</p>
            <div className="doctor-options">
              {doctors.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  className={`doctor-option${selectedDoctor?.id === doc.id ? ' selected' : ''}`}
                  onClick={() => setSelectedDoctor(doc)}
                >
                  <span className="doctor-option-avatar">{doc.initials}</span>
                  <span className="doctor-option-info">
                    <span className="doctor-option-name">{doc.name}</span>
                    {doc.specialty && <span className="doctor-option-specialty">{doc.specialty}</span>}
                    {doc.id === 'any' && (
                      <span className="doctor-option-avail">Fastest available slot</span>
                    )}
                  </span>
                  <span className="doctor-option-check" aria-hidden />
                </button>
              ))}
            </div>
          </div>

          {/* Date & time */}
          <div className={`booking-step${step === 'datetime' ? ' active' : ''}`}>
            <h3 className="step-title">Pick a date &amp; time</h3>
            <p className="step-subtitle">We&apos;re open daily 10:00 AM – 8:00 PM</p>
            <div className="form-group">
              <label className="form-label" htmlFor="booking-date">
                Preferred date
              </label>
              <input
                id="booking-date"
                type="date"
                className="form-input"
                value={selectedDate}
                min={getMinDate()}
                max={getMaxDate()}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                  setSelectedTime('')
                }}
              />
            </div>
            {selectedDate && (
              <div className="form-group">
                <p className="time-slots-title">Available times</p>
                <div className="time-slots">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`time-slot${selectedTime === t ? ' selected' : ''}`}
                      onClick={() => setSelectedTime(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className={`booking-step${step === 'details' ? ' active' : ''}`}>
            <h3 className="step-title">Your details</h3>
            <p className="step-subtitle">We&apos;ll send confirmation to your email</p>
            <div className="form-group">
              <label className="form-label" htmlFor="booking-name">
                Full name *
              </label>
              <input
                id="booking-name"
                type="text"
                className="form-input"
                placeholder="e.g. John Smith"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="booking-email">
                Email *
              </label>
              <input
                id="booking-email"
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="booking-phone">
                Phone
              </label>
              <input
                id="booking-phone"
                type="tel"
                className="form-input"
                placeholder="0XX-XXX-XXXX"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="booking-notes">
                Notes (optional)
              </label>
              <textarea
                id="booking-notes"
                className="form-input"
                rows={3}
                placeholder="Any concerns or special requests?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Confirm */}
          <div className={`booking-step${step === 'confirm' ? ' active' : ''}`}>
            <h3 className="step-title">Confirm your appointment</h3>
            <p className="step-subtitle">Review before submitting</p>
            <div className="confirmation-details">
              <div className="confirmation-row">
                <span className="confirmation-label">Service</span>
                <span className="confirmation-value">
                  {selectedService?.icon} {selectedService?.name}
                </span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-label">Doctor</span>
                <span className="confirmation-value">{selectedDoctor?.name}</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-label">Date</span>
                <span className="confirmation-value">{formattedDate}</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-label">Time</span>
                <span className="confirmation-value">{selectedTime}</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-label">Name</span>
                <span className="confirmation-value">{patientName}</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-label">Email</span>
                <span className="confirmation-value">{patientEmail}</span>
              </div>
            </div>
            {error && (
              <div className="booking-error" role="alert">
                {error}
              </div>
            )}
          </div>

          {/* Success */}
          <div className={`booking-step${step === 'success' ? ' active' : ''}`}>
            <div className="confirmation-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="confirmation-title">Booking received!</h3>
            <p className="confirmation-subtitle">
              Thank you, {patientName}. We&apos;ll confirm by email within one business hour.
            </p>
            <div className="confirmation-details">
              <div className="confirmation-row">
                <span className="confirmation-label">Service</span>
                <span className="confirmation-value">{selectedService?.name}</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-label">Doctor</span>
                <span className="confirmation-value">{selectedDoctor?.name}</span>
              </div>
              <div className="confirmation-row">
                <span className="confirmation-label">When</span>
                <span className="confirmation-value">
                  {formattedDate} · {selectedTime}
                </span>
              </div>
            </div>
            <p className="form-note" style={{ textAlign: 'center', marginTop: 8 }}>
              Questions? LINE <strong>@sound.dentalclinic</strong> or call <strong>099-793-5635</strong>
            </p>
          </div>
        </div>

        {step !== 'success' ? (
          <footer className="booking-footer">
            {step !== 'service' && (
              <button type="button" className="btn-back" onClick={goBack} disabled={isLoading}>
                Back
              </button>
            )}
            <button
              type="button"
              className="btn-next"
              disabled={!canContinue() || isLoading}
              onClick={step === 'confirm' ? submit : goNext}
            >
              {isLoading
                ? 'Saving…'
                : step === 'confirm'
                  ? 'Confirm booking'
                  : 'Continue'}
            </button>
          </footer>
        ) : (
          <footer className="booking-footer">
            <button type="button" className="btn-next" onClick={close}>
              Done
            </button>
          </footer>
        )}
      </div>
    </div>
  )
}
