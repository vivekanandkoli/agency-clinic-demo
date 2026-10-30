import type { Metadata } from 'next'
import './admin.css'

export const metadata: Metadata = {
  title: 'Admin — Smile Bangkok Dental',
  description: 'Admin panel for Smile Bangkok Dental',
  robots: 'noindex, nofollow',
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children
}
