export type PatientReview = {
  id: string
  quote: string
  author: string
  /** Short context shown under the name */
  subtitle?: string
  initials: string
}

export const PATIENT_REVIEWS: PatientReview[] = [
  {
    id: '1',
    quote:
      "The best dental experience I've ever had. Dr. Nattapong made my implant procedure completely painless. The clinic is modern, clean, and the staff is incredibly friendly.",
    author: 'Sarah M.',
    subtitle: 'Expat from UK',
    initials: 'SM',
  },
  {
    id: '2',
    quote:
      'After years of hiding my smile, Invisalign at Sound Dental changed everything. Dr. Pimnara is amazing — my teeth are now perfectly aligned. Worth every baht!',
    author: 'ธนพล ว.',
    subtitle: 'Bangkok',
    initials: 'ธ',
  },
  {
    id: '3',
    quote:
      'Found this clinic for emergency toothache on a Sunday. They saw me within an hour and fixed everything. Professional, caring, and reasonable prices. Highly recommend!',
    author: 'Michael K.',
    subtitle: 'Australian Tourist',
    initials: 'MK',
  },
  {
    id: '4',
    quote:
      'The hygienist explained every step in English. Zero judgment, zero pain. I finally stopped avoiding the dentist.',
    author: 'Lisa T.',
    subtitle: 'Remote worker, Bangkok',
    initials: 'LT',
  },
  {
    id: '5',
    quote:
      'Whitening results after one session were incredible. They showed me before/after photos and the difference was obvious.',
    author: 'James R.',
    subtitle: 'Business traveller',
    initials: 'JR',
  },
]
