import Link from 'next/link'
import { Suspense } from 'react'
import AdminLoginForm from '@/components/admin-login-form'

export default function AdminLoginPage() {
  return (
    <div className="admin-login-page">
      <aside className="admin-login-brand">
        <div className="admin-login-brand-inner">
          <p className="admin-login-eyebrow">Sound Dental Clinic</p>
          <h1 className="admin-login-brand-title">Admin</h1>
          <p className="admin-login-brand-text">
            Manage bookings, services, and your public site from one place.
          </p>
        </div>
      </aside>

      <div className="admin-login-panel">
        <div className="admin-login-card">
          <div className="admin-login-card-header">
            <h2 className="admin-login-heading">Sign in</h2>
          </div>

          <Suspense fallback={<p className="admin-login-loading">Loading…</p>}>
            <AdminLoginForm />
          </Suspense>

          <p className="admin-login-footer">
            <Link href="/" className="admin-login-back">
              ← Back to website
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
