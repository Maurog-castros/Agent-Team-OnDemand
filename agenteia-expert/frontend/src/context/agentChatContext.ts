import { createContext } from 'react'

import type { AgentId } from '../data/agents'

export interface AgentChatContextValue {
  agentId: AgentId
  setAgentId: (id: AgentId) => void
}

export const AgentChatContext = createContext<AgentChatContextValue | null>(null)
