import { useState, type ReactNode } from 'react'

import { DEFAULT_CHAT_AGENT } from '../data/agents'
import { AgentChatContext } from './agentChatContext'

export function AgentChatProvider({ children }: { children: ReactNode }) {
  const [agentId, setAgentId] = useState(DEFAULT_CHAT_AGENT)
  return (
    <AgentChatContext.Provider value={{ agentId, setAgentId }}>
      {children}
    </AgentChatContext.Provider>
  )
}
