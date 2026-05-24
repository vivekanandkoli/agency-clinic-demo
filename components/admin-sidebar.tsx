'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CalendarDays,
  ExternalLink,
  LayoutDashboard,
  Mail,
  Settings,
  Stethoscope,
  Users,
} from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarDays },
  { href: '/admin/services', label: 'Services', icon: Stethoscope },
  { href: '/admin/doctors', label: 'Doctors', icon: Users },
  { href: '/admin/contacts', label: 'Contacts', icon: Mail },
  { href: '/admin/settings', label: 'Site settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="admin-brand-title">Sound Dental</div>
        <div className="admin-brand-sub">Admin panel</div>
      </div>
      <nav aria-label="Admin navigation">
        <ul className="admin-nav">
          {NAV.map((item) => {
            const Icon = item.icon
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`admin-nav-link${active ? ' is-active' : ''}`}
                >
                  <span className="admin-nav-icon" aria-hidden>
                    <Icon strokeWidth={2} />
                  </span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="admin-sidebar-footer">
        <Link href="/" className="admin-nav-link">
          <span className="admin-nav-icon" aria-hidden>
            <ExternalLink strokeWidth={2} />
          </span>
          View public site
        </Link>
      </div>
    </aside>
  )
}
