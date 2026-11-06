export const dynamic = 'force-dynamic'

import { tryCreateAdminClient } from '@/lib/admin-db'
import type { ChatSession } from '@/lib/types'
import ChatsList from './chats-list'

async function getChats(): Promise<ChatSession[]> {
  const supabase = tryCreateAdminClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(200)
  if (error) {
    console.error('Error fetching chats:', error)
    return []
  }
  return data ?? []
}

export default async function ChatsPage() {
  const chats = await getChats()

  return (
    <div>
      <h1 className="admin-page-title">Chats</h1>
      <p className="admin-page-sub">
        {chats.length} conversation{chats.length !== 1 ? 's' : ''} with the website chatbot
        {chats.length === 200 ? ' (latest 200)' : ''}
      </p>
      <ChatsList chats={chats} />
    </div>
  )
}
