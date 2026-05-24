'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import {
  TRANSFORMATION_CASES,
  type TransformationCase,
  type TransformationDisplay,
} from '@/lib/transformation-cases'

type ClinicalDisplay = Extract<
  TransformationDisplay,
  { type: 'split-horizontal' } | { type: 'split-vertical-columns' }
>

function CompareShell({
  before,
  after,
}: {
  before: ReactNode
  after: ReactNode
}) {
  return (
    <div className="transform-compare">
      <figure className="transform-half transform-half--before">{before}</figure>
      <div className="transform-divider" aria-hidden="true">
        <span className="transform-divider-icon">→</span>
      </div>
      <figure className="transform-half transform-half--after">{after}</figure>
    </div>
  )
}

function CompareBadge({ side }: { side: 'before' | 'after' }) {
  return (
    <p className={`transform-badge transform-badge--${side}`}>
      {side === 'before' ? 'Before' : 'After'}
    </p>
  )
}

function ClinicalPanel({
  src,
  alt,
  side,
  crop,
}: {
  src: string
  alt: string
  side: 'before' | 'after'
  crop: 'left' | 'right' | 'top' | 'bottom'
}) {
  const cropClass = {
    left: 'transform-img--paired-before',
    right: 'transform-img--paired-after',
    top: 'transform-img--paired-top',
    bottom: 'transform-img--paired-bottom',
  }[crop]

  return (
    <div className="transform-img-wrap">
      <Image
        src={src}
        alt={`${alt} — ${side}`}
        fill
        className={`transform-img transform-img--clinical ${cropClass}`}
        sizes="(max-width: 640px) 50vw, 400px"
        draggable={false}
      />
      <CompareBadge side={side} />
    </div>
  )
}

function ClinicalCompare({ display, alt }: { display: ClinicalDisplay; alt: string }) {
  const beforeCrop = display.type === 'split-horizontal' ? 'left' : 'top'
  const afterCrop = display.type === 'split-horizontal' ? 'right' : 'bottom'

  return (
    <CompareShell
      before={
        <ClinicalPanel src={display.src} alt={alt} side="before" crop={beforeCrop} />
      }
      after={
        <ClinicalPanel src={display.src} alt={alt} side="after" crop={afterCrop} />
      }
    />
  )
}

function DualCompare({
  before,
  after,
}: {
  before: { src: string; alt: string }
  after: { src: string; alt: string }
}) {
  return (
    <CompareShell
      before={
        <div className="transform-img-wrap">
          <Image
            src={before.src}
            alt={before.alt}
            fill
            className="transform-img"
            sizes="(max-width: 640px) 50vw, 400px"
            draggable={false}
          />
          <CompareBadge side="before" />
        </div>
      }
      after={
        <div className="transform-img-wrap">
          <Image
            src={after.src}
            alt={after.alt}
            fill
            className="transform-img"
            sizes="(max-width: 640px) 50vw, 400px"
            draggable={false}
          />
          <CompareBadge side="after" />
        </div>
      }
    />
  )
}

function CaseComparison({ active }: { active: TransformationCase }) {
  const { display } = active

  if (display.type === 'dual') {
    return <DualCompare before={display.before} after={display.after} />
  }

  return <ClinicalCompare display={display} alt={display.alt} />
}

export default function TransformationShowcase() {
  const [activeId, setActiveId] = useState(TRANSFORMATION_CASES[0].id)
  const active = TRANSFORMATION_CASES.find((c) => c.id === activeId) ?? TRANSFORMATION_CASES[0]

  return (
    <div className="transform-showcase">
      <div className="transform-tabs" role="tablist" aria-label="Clinical before and after cases">
        {TRANSFORMATION_CASES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === activeId}
            className={`transform-tab${item.id === activeId ? ' transform-tab--active' : ''}`}
            onClick={() => setActiveId(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="transform-panel" role="tabpanel">
        <div className="transform-compare-slot">
          <CaseComparison key={active.id} active={active} />
        </div>

        <div className="transform-details">
          <p className="transform-detail transform-detail--before">
            <span className="transform-detail-label">Before</span>
            {active.issue}
          </p>
          <p className="transform-detail transform-detail--after">
            <span className="transform-detail-label">After</span>
            {active.result}
          </p>
        </div>

        <p className="transform-caption">{active.caption}</p>
        <p className="transform-credit">
          Clinical sample · {active.credit}. Results vary. Replace with your clinic&apos;s own
          patient photos when available.
        </p>
      </div>
    </div>
  )
}
