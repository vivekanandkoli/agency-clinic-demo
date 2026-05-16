import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sound Dental Clinic — คลินิกทันตกรรมซาวด์ | Premium Dental Care in Bangkok',
  description:
    'Premium dental clinic in Bangkok offering teeth whitening, dental implants, Invisalign, and comprehensive dental care. Book your appointment today!',
  keywords: 'dental clinic Bangkok, teeth whitening, dental implants, Invisalign, orthodontics',
  openGraph: {
    title: 'Sound Dental Clinic — Premium Dental Care in Bangkok',
    description: 'Modern dental care with a gentle, personalized approach.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        {/* Existing premium CSS */}
        <link rel="stylesheet" href="/css/main.css" />
        <link rel="stylesheet" href="/css/components.css" />
        <link rel="stylesheet" href="/css/booking.css" />
        <link rel="stylesheet" href="/css/responsive.css" />
        <link rel="stylesheet" href="/css/interactions.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
