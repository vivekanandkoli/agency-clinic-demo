import { getAdminConfigError } from '@/lib/auth/admin'

export default function AdminConfigAlert() {
  const message = getAdminConfigError()
  if (!message) return null

  return (
    <div className="admin-alert admin-alert-warning" role="alert">
      <strong>Setup required:</strong> {message}
    </div>
  )
}
