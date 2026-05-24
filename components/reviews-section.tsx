'use client'

import { useSyncExternalStore } from 'react'
import { PATIENT_REVIEWS, type PatientReview } from '@/lib/review-quotes'

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', onStoreChange)
  return () => mq.removeEventListener('change', onStoreChange)
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getReducedMotionServerSnapshot() {
  return false
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #2c6e5a 0%, #4a9b82 100%)',
  'linear-gradient(135deg, #1a4d3f 0%, #3d8b72 100%)',
  'linear-gradient(135deg, #3d7a68 0%, #6bb89a 100%)',
  'linear-gradient(135deg, #245a4a 0%, #52a088 100%)',
  'linear-gradient(135deg, #2f7560 0%, #5cad94 100%)',
]

function avatarGradient(id: string) {
  const n = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return AVATAR_GRADIENTS[n % AVATAR_GRADIENTS.length]
}

function StarRow({ className = '' }: { className?: string }) {
  return (
    <div className={`review-stars-row ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="review-star-icon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.35l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  )
}

function QuoteIcon() {
  return (
    <svg className="review-quote-icon" viewBox="0 0 32 32" aria-hidden="true">
      <path
        fill="currentColor"
        d="M9.5 8C6.5 8 4 10.2 4 13.5c0 4.2 3.5 7.2 7.8 9.8l1.2-2.4c-2.8-1.5-4.5-3.2-4.5-5.2 0-1.2 1-2.2 2.5-2.2.9 0 1.7.4 2.2 1.1L14 10.5C12.8 9 11.2 8 9.5 8zm13 0c-3 0-5.5 2.2-5.5 5.5 0 4.2 3.5 7.2 7.8 9.8l1.2-2.4c-2.8-1.5-4.5-3.2-4.5-5.2 0-1.2 1-2.2 2.5-2.2.9 0 1.7.4 2.2 1.1L27 10.5C25.8 9 24.2 8 22.5 8z"
      />
    </svg>
  )
}

function VerifiedBadge() {
  return (
    <span className="review-verified">
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path
          fill="currentColor"
          d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.7 5.3l-4.2 4.5-2-1.8-1.2 1.3 3.2 2.9 5.4-5.7-1.2-1.2z"
        />
      </svg>
      Verified patient
    </span>
  )
}

function ReviewAvatar({ initials, id }: { initials: string; id: string }) {
  return (
    <div
      className="review-avatar"
      style={{ background: avatarGradient(id) }}
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}

function ReviewCard({
  r,
  variant,
  featured,
}: {
  r: PatientReview
  variant: 'static' | 'marquee'
  featured?: boolean
}) {
  const cardClass =
    variant === 'marquee'
      ? 'marquee-review-card review-card-enhanced'
      : `review-card review-card-enhanced${featured ? ' review-card--featured' : ''}`

  return (
    <article className={cardClass}>
      <div className="review-card-glow" aria-hidden="true" />
      <div className="review-card-inner">
        <div className="review-card-top">
          <ReviewAvatar initials={r.initials} id={r.id} />
          <div className="review-card-head-meta">
            <StarRow />
            <VerifiedBadge />
          </div>
        </div>
        <QuoteIcon />
        <p className={variant === 'marquee' ? 'marquee-text review-text-body' : 'review-text review-text-body'}>
          {r.quote}
        </p>
        <footer className={variant === 'marquee' ? 'marquee-footer review-footer' : 'review-meta review-footer'}>
          <span className={variant === 'marquee' ? 'marquee-author' : 'review-author'}>{r.author}</span>
          {r.subtitle && (
            <span className={variant === 'marquee' ? 'marquee-subtitle' : 'review-subtitle'}>
              {r.subtitle}
            </span>
          )}
        </footer>
      </div>
    </article>
  )
}

function StaticGrid() {
  return (
    <div className="reviews-grid reviews-grid--static">
      {PATIENT_REVIEWS.slice(0, 3).map((r, i) => (
        <ReviewCard key={r.id} r={r} variant="static" featured={i === 0} />
      ))}
    </div>
  )
}

function Marquee() {
  return (
    <div
      className="reviews-marquee-wrapper"
      role="region"
      aria-label="Patient testimonials scrolling"
    >
      <div className="reviews-marquee-track">
        {PATIENT_REVIEWS.map((r) => (
          <ReviewCard key={r.id} r={r} variant="marquee" />
        ))}
        <div className="reviews-marquee-dupes" aria-hidden="true">
          {PATIENT_REVIEWS.map((r) => (
            <ReviewCard key={`dup-${r.id}`} r={r} variant="marquee" />
          ))}
        </div>
      </div>
    </div>
  )
}

function ReviewsSummary() {
  return (
    <div className="reviews-summary" aria-label="Overall patient rating">
      <div className="reviews-summary-score">
        <span className="reviews-summary-number">4.9</span>
        <StarRow className="reviews-summary-stars" />
      </div>
      <p className="reviews-summary-label">Average rating from 2,400+ patients</p>
    </div>
  )
}

export default function ReviewsSection() {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  )

  return (
    <div className="reviews-section-body">
      <ReviewsSummary />

      <div className="reviews-trust-strip">
        <span className="reviews-trust-pill reviews-trust-pill--highlight">
          <StarRow className="reviews-trust-stars-inline" />
          <span>4.9 average</span>
        </span>
        <span className="reviews-trust-pill">
          <span className="reviews-trust-icon" aria-hidden="true">✓</span>
          2,400+ happy patients
        </span>
        <span className="reviews-trust-pill">English &amp; Thai</span>
      </div>

      {prefersReducedMotion ? <StaticGrid /> : <Marquee />}
    </div>
  )
}
