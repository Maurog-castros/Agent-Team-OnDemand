import type { AgentId } from '../data/agents'
import { agentIdToSlug } from '../data/agents'
import type { GroupMeetingState, GroupMessage } from '../types/groupChat'

const STORAGE_KEY = 'agenteia-group-meeting-v1'

export const DEFAULT_PARTICIPANTS: AgentId[] = [
  'agenteia_expert',
  'devops_arquitecto',
  'scrum_master_pm',
]

export const USER_DISPLAY_NAME = 'Mauricio A.'

function defaultState(): GroupMeetingState {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    title: 'Reunión de equipo',
    participantIds: [...DEFAULT_PARTICIPANTS],
    messages: [
      {
        id: crypto.randomUUID(),
        speakerType: 'system',
        author: 'Sistema',
        text: 'Reunión iniciada. Escribe un mensaje y cada agente responderá con su perspectiva.',
        timestamp: now,
      },
    ],
    updatedAt: now,
  }
}

export function loadGroupMeeting(): GroupMeetingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return defaultState()
    }
    const parsed = JSON.parse(raw) as GroupMeetingState
    if (!parsed.messages || !parsed.participantIds) {
      return defaultState()
    }
    return parsed
  } catch {
    return defaultState()
  }
}

export function saveGroupMeeting(state: GroupMeetingState): void {
  const payload: GroupMeetingState = {
    ...state,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function clearGroupMeeting(): GroupMeetingState {
  const fresh = defaultState()
  saveGroupMeeting(fresh)
  return fresh
}

export function toApiTurns(messages: GroupMessage[]): {
  author: string
  speaker_type: 'user' | 'agent'
  content: string
  agent_slug?: string
}[] {
  return messages
    .filter((message) => message.speakerType !== 'system' && message.text && !message.streaming)
    .map((message) => ({
      author: message.author,
      speaker_type: message.speakerType === 'user' ? 'user' : 'agent',
      content: message.text,
      agent_slug: message.agentSlug ?? (message.agentId ? agentIdToSlug(message.agentId) : undefined),
    }))
}
