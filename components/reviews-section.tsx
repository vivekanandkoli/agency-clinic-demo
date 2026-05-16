'use client'

import { useSyncExternalStore } from 'react'
import { PATIENT_REVIEWS } from '@/lib/review-quotes'

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

function ReviewAvatar({ initials }: { initials: string }) {
  return <div className="review-avatar" aria-hidden="true">{initials}</div>
}

function StaticGrid() {
  return (
    <div className="reviews-grid reviews-grid--static">
      {PATIENT_REVIEWS.slice(0, 3).map((r) => (
        <article key={r.id} className="review-card">
          <div className="review-card-top">
            <ReviewAvatar initials={r.initials} />
            <div className="review-stars" aria-hidden="true">
              ★★★★★
            </div>
          </div>
          <p className="review-text">&ldquo;{r.quote}&rdquo;</p>
          <footer className="review-meta">
            <span className="review-author">{r.author}</span>
            {r.subtitle && <span className="review-subtitle">{r.subtitle}</span>}
          </footer>
        </article>
      ))}
    </div>
  )
}

function MarqueeCard({ r }: { r: (typeof PATIENT_REVIEWS)[0] }) {
  return (
    <article className="marquee-review-card">
      <div className="marquee-card-head">
        <ReviewAvatar initials={r.initials} />
        <div className="marquee-stars" aria-hidden="true">
          ★★★★★
        </div>
      </div>
      <p className="marquee-text">&ldquo;{r.quote}&rdquo;</p>
      <footer className="marquee-footer">
        <span className="marquee-author">{r.author}</span>
        {r.subtitle && <span className="marquee-subtitle">{r.subtitle}</span>}
      </footer>
    </article>
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
          <MarqueeCard key={r.id} r={r} />
        ))}
        {/* Duplicated row for seamless loop; hidden from assistive tech */}
        <div className="reviews-marquee-dupes" aria-hidden="true">
          {PATIENT_REVIEWS.map((r) => (
            <MarqueeCard key={`dup-${r.id}`} r={r} />
          ))}
        </div>
      </div>
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
    <>
      <div className="reviews-trust-strip">
        <span className="reviews-trust-pill">
          <span className="reviews-trust-stars" aria-hidden="true">
            ★★★★★
          </span>
          <span>4.9 average</span>
        </span>
        <span className="reviews-trust-pill">2,400+ happy patients</span>
        <span className="reviews-trust-pill">English &amp; Thai</span>
      </div>

      {prefersReducedMotion ? <StaticGrid /> : <Marquee />}
    </>
  )
}
