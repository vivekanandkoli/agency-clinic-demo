import type { Metadata } from 'next'
import './admin.css'

export const metadata: Metadata = {
  title: 'Admin — Sound Dental Clinic',
  description: 'Admin panel for Sound Dental Clinic',
  robots: 'noindex, nofollow',
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children
}
