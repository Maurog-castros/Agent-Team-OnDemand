import { ChatPanel } from '../components/chat/ChatPanel'
import { PageHeader } from '../components/common/StatusBadge'

export function ChatPage() {
  return (
    <>
      <PageHeader
        title="Chat"
        description="Conversación directa con los agentes. No confundir con el timeline de reuniones."
      />
      <ChatPanel />
    </>
  )
}
