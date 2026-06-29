import { useContext } from 'react'

import { AgentChatContext } from './agentChatContext'

export function useAgentChat() {
  const ctx = useContext(AgentChatContext)
  if (!ctx) {
    throw new Error('useAgentChat must be used within AgentChatProvider')
  }
  return ctx
}
