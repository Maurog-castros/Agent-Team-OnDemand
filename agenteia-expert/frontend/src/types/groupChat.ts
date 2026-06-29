import type { AgentId } from '../data/agents'

export type GroupSpeakerType = 'user' | 'agent' | 'system'

export interface GroupMessage {
  id: string
  speakerType: GroupSpeakerType
  author: string
  text: string
  timestamp: string
  agentId?: AgentId
  agentSlug?: string
  streaming?: boolean
}

export interface GroupMeetingState {
  id: string
  title: string
  participantIds: AgentId[]
  messages: GroupMessage[]
  updatedAt: string
}

export type GroupChatStreamEventType =
  | 'agent_start'
  | 'token'
  | 'agent_done'
  | 'done'
  | 'error'

export interface GroupChatStreamEvent {
  type: GroupChatStreamEventType
  content?: string
  agent_slug?: string
  agent_name?: string
}

export interface GroupChatTurnPayload {
  author: string
  speaker_type: 'user' | 'agent'
  content: string
  agent_slug?: string
}

export interface GroupChatRequestPayload {
  participant_slugs: string[]
  messages: GroupChatTurnPayload[]
  user_name?: string
}
