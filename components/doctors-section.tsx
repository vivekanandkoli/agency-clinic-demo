'use client'

import { useState } from 'react'
import type { Doctor } from '@/lib/types'

function openBookingModal() {
  document.dispatchEvent(new CustomEvent('openBookingModal'))
}

function DoctorFlipCard({ doctor }: { doctor: Doctor }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <article
      className={`doctor-card${flipped ? ' flipped' : ''}`}
      onClick={() => setFlipped((f) => !f)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setFlipped((f) => !f)
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${doctor.name}, ${doctor.specialty}. Click to flip card.`}
    >
      <div className="doctor-card-inner">
        <div className="doctor-card-front">
          {doctor.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={doctor.image_url}
              alt=""
              className="doctor-avatar doctor-avatar--photo"
            />
          ) : (
            <div className="doctor-avatar">{doctor.initials}</div>
          )}
          <h3 className="doctor-name">{doctor.name}</h3>
          {doctor.specialty && <p className="doctor-role">{doctor.specialty}</p>}
          {doctor.experience_years > 0 && (
            <p className="doctor-experience">{doctor.experience_years}+ years experience</p>
          )}
          {doctor.qualifications && (
            <p className="doctor-detail doctor-detail--front">{doctor.qualifications}</p>
          )}
          <span className="flip-hint" aria-hidden>
            Tap for details
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </svg>
          </span>
        </div>

        <div className="doctor-card-back">
          <p className="back-role">{doctor.specialty}</p>
          <p className="back-name">{doctor.name}</p>
          {doctor.qualifications && <p className="back-credential">{doctor.qualifications}</p>}
          {doctor.bio && <p className="back-credential">{doctor.bio}</p>}
          <p className="back-availability">Mon – Sat · 10:00 – 20:00</p>
          <button
            type="button"
            className="back-book-btn"
            onClick={(e) => {
              e.stopPropagation()
              openBookingModal()
            }}
          >
            Book with {doctor.name.split(' ').slice(-1)[0]}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function DoctorsSection({ doctors }: { doctors: Doctor[] }) {
  return (
    <section id="doctors">
      <div className="page-container">
        <header className="section-header section-header--wide">
          <span className="section-label">Expert Team</span>
          <h2 className="section-title scramble-title">
            Meet Our <span>Specialists</span>
          </h2>
          <p className="section-sub">
            Board-certified dentists with decades of combined experience. Tap a card to learn more, or
            book directly from the back.
          </p>
        </header>
        <div className="doctors-grid doctors-grid--flip">
          {doctors.map((doctor) => (
            <DoctorFlipCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>
  )
}
