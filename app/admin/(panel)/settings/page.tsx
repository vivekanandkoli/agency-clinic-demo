export const dynamic = 'force-dynamic'

import { getAllSiteSettings } from '@/lib/site-settings'
import SettingsForm from './settings-form'

export default async function SettingsPage() {
  const settings = await getAllSiteSettings()

  return (
    <div>
      <h1 className="admin-page-title">Site settings</h1>
      <p className="admin-page-sub">
        Edit clinic details, hero copy, and homepage stats. Active services and doctors are managed
        on their own pages.
      </p>
      <SettingsForm initial={settings} />
    </div>
  )
}
