import { redirect } from 'next/navigation'
import AdminConfigAlert from '@/components/admin-config-alert'
import AdminHeader from '@/components/admin-header'
import AdminSidebar from '@/components/admin-sidebar'
import { getAdminConfigError, isAdminUser } from '@/lib/auth/admin'
import { createClient } from '@/lib/supabase/server'

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const configError = getAdminConfigError()

  if (!configError) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect('/admin/login')
    }

    if (!isAdminUser(user)) {
      redirect('/admin/login?error=forbidden')
    }

    return (
      <AdminPanelChrome email={user.email ?? 'Admin'}>{children}</AdminPanelChrome>
    )
  }

  return <AdminPanelChrome email="Admin">{children}</AdminPanelChrome>
}

function AdminPanelChrome({
  email,
  children,
}: {
  email: string
  children: React.ReactNode
}) {
  return (
    <div className="admin-app" data-admin-app>
      <div className="admin-shell">
        <AdminSidebar />
        <div className="admin-main-wrap">
          <AdminHeader email={email} />
          <main className="admin-content">
            <AdminConfigAlert />
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
