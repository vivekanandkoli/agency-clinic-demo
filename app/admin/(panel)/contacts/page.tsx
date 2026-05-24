export const dynamic = 'force-dynamic'

import { tryCreateAdminClient } from '@/lib/admin-db'
import ContactsTable from './contacts-table'

async function getContacts() {
  const supabase = tryCreateAdminClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('Error fetching contacts:', error)
    return []
  }
  return data ?? []
}

export default async function ContactsPage() {
  const contacts = await getContacts()

  return (
    <div>
      <h1 className="admin-page-title">Contact messages</h1>
      <p className="admin-page-sub">
        {contacts.length} message{contacts.length !== 1 ? 's' : ''} from the public contact form
      </p>
      <ContactsTable initialContacts={contacts} />
    </div>
  )
}
