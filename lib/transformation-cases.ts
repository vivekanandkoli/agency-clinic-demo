export type TransformationDisplay =
  | {
      type: 'dual'
      before: { src: string; alt: string }
      after: { src: string; alt: string }
    }
  | {
      /** One photo: before on the left, after on the right */
      type: 'split-horizontal'
      src: string
      alt: string
    }
  | {
      /** One photo: before on top, after on bottom — shown in left/right panels */
      type: 'split-vertical-columns'
      src: string
      alt: string
    }

export type TransformationCase = {
  id: string
  label: string
  issue: string
  result: string
  caption: string
  credit: string
  display: TransformationDisplay
}

/**
 * Real clinical before/after samples (Wikimedia Commons).
 * Dual = separate photos; split = one composite image cropped per panel.
 */
export const TRANSFORMATION_CASES: TransformationCase[] = [
  {
    id: 'teeth-cleaning',
    label: 'Teeth cleaning',
    issue: 'Heavy plaque, inflamed gums, and bleeding before professional scaling',
    result: 'Cleaner teeth and healthier gum tissue nine days after scaling and root planing',
    caption: 'Same patient · before (left) and after (right) dental cleaning',
    credit: 'Onetimeuseaccount / CC0 (Wikimedia Commons)',
    display: {
      type: 'dual',
      before: {
        src: '/images/transformations/gingivitis-before.jpg',
        alt: 'Gingivitis and plaque before professional teeth cleaning',
      },
      after: {
        src: '/images/transformations/gingivitis-after.jpg',
        alt: 'Healthier gums and teeth after scaling treatment',
      },
    },
  },
  {
    id: 'gum-treatment',
    label: 'Gum treatment',
    issue: 'Gingivitis with swollen, irritated gum tissue before treatment',
    result: 'Improved gum health after periodontal cleaning (same patient, nine days later)',
    caption: 'Same patient · before (left) and after (right) gum treatment',
    credit: 'Onetimeuseaccount / CC0 (Wikimedia Commons)',
    display: {
      type: 'split-vertical-columns',
      src: '/images/transformations/gingivitis-comparison.jpg',
      alt: 'Gingivitis before and after scaling on the same patient',
    },
  },
  {
    id: 'open-bite',
    label: 'Open bite alignment',
    issue: 'Anterior open bite — upper and lower front teeth do not meet when biting',
    result: 'Corrected bite and tooth contact after orthodontic treatment',
    caption: 'Same patient · before (left) and after (right) open bite treatment',
    credit: 'Jeffrey Dorfman / CC BY-SA 3.0 (Wikimedia Commons)',
    display: {
      type: 'split-horizontal',
      src: '/images/transformations/open-bite-treatment.jpg',
      alt: 'Orthodontic open bite treatment before and after',
    },
  },
]
