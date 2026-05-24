'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminHeader({ email }: { email: string }) {
  const router = useRouter()
  const initial = email.charAt(0).toUpperCase()

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header className="admin-topbar">
      <div className="admin-user">
        <div className="admin-avatar" aria-hidden>
          {initial}
        </div>
        <span>{email}</span>
      </div>
      <div className="admin-topbar-actions">
        <button type="button" className="admin-btn admin-btn-ghost" onClick={signOut}>
          Sign out
        </button>
      </div>
    </header>
  )
}
