import { AgentConfigPanel } from '../components/chat/AgentConfigPanel'
import { ChatPanel } from '../components/chat/ChatPanel'
import { useAgentChat } from '../context/useAgentChat'
import styles from './ChatPage.module.css'

export function ChatPage() {
  const { agentId } = useAgentChat()

  return (
    <div className={styles.layout}>
      <ChatPanel />
      <AgentConfigPanel key={agentId} />
    </div>
  )
}
