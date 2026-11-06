'use client'

import { useState } from 'react'
import type { ChatSession } from '@/lib/types'

function firstQuestion(chat: ChatSession) {
  return chat.messages.find((m) => m.role === 'user')?.content ?? '(no messages)'
}

export default function ChatsList({ chats }: { chats: ChatSession[] }) {
  const [search, setSearch] = useState('')

  const query = search.trim().toLowerCase()
  const filtered = query
    ? chats.filter((c) => c.messages.some((m) => m.content.toLowerCase().includes(query)))
    : chats

  if (chats.length === 0) {
    return (
      <div className="admin-card">
        <div className="admin-empty">
          <div className="admin-empty-icon">💬</div>
          <p>No chatbot conversations yet.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="admin-toolbar">
        <input
          type="search"
          className="admin-input admin-search-input"
          placeholder="Search messages…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="admin-card">
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <p>No conversations match “{search}”.</p>
          </div>
        ) : (
          filtered.map((chat) => {
            const visitorMessages = chat.messages.filter((m) => m.role === 'user').length
            return (
              <details key={chat.id} className="admin-list-item admin-chat">
                <summary className="admin-chat-summary">
                  <span className="admin-chat-question">{firstQuestion(chat)}</span>
                  <span className="admin-chat-meta">
                    {visitorMessages} question{visitorMessages !== 1 ? 's' : ''} ·{' '}
                    {new Date(chat.updated_at).toLocaleString()}
                  </span>
                </summary>
                {/* Plain text only: these are visitor input and model output. */}
                <div className="admin-chat-transcript">
                  {chat.messages.map((m, i) => (
                    <div key={i} className={`admin-chat-msg admin-chat-msg-${m.role}`}>
                      <span className="admin-chat-role">
                        {m.role === 'user' ? 'Visitor' : 'Bot'}
                      </span>
                      <p>{m.content}</p>
                    </div>
                  ))}
                </div>
              </details>
            )
          })
        )}
      </div>
    </>
  )
}
