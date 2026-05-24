import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sound Dental Clinic — Premium Dental Care in Bangkok',
  description:
    'Premium dental clinic in Bangkok offering teeth whitening, dental implants, Invisalign, and comprehensive dental care.',
  keywords: 'dental clinic Bangkok, teeth whitening, dental implants, Invisalign',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦷</text></svg>"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
