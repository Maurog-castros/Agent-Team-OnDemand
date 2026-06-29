import { useCallback, useEffect, useRef, useState } from 'react'

import { streamGroupMeeting } from '../api/groupChat'
import { agentIdToSlug, getAgentById, type AgentId } from '../data/agents'
import {
  clearGroupMeeting,
  loadGroupMeeting,
  saveGroupMeeting,
  toApiTurns,
  USER_DISPLAY_NAME,
} from '../storage/groupChatStore'
import type { GroupMeetingState, GroupMessage } from '../types/groupChat'

function slugToAgentId(slug: string): AgentId | undefined {
  const normalized = slug.replace(/-/g, '_')
  const ids: AgentId[] = [
    'agenteia_expert',
    'desarrollador_fullstack',
    'devops_arquitecto',
    'scrum_master_pm',
  ]
  return ids.find((id) => id === normalized)
}

export function useGroupChat() {
  const [state, setState] = useState<GroupMeetingState>(() => loadGroupMeeting())
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    saveGroupMeeting(state)
  }, [state])

  const setParticipants = useCallback((participantIds: AgentId[]) => {
    if (participantIds.length < 2) {
      return
    }
    setState((prev) => ({
      ...prev,
      participantIds,
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const deleteChat = useCallback(() => {
    const fresh = clearGroupMeeting()
    setState(fresh)
    setError(null)
  }, [])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isStreaming) {
        return
      }

      const userMessage: GroupMessage = {
        id: crypto.randomUUID(),
        speakerType: 'user',
        author: USER_DISPLAY_NAME,
        text: trimmed,
        timestamp: new Date().toISOString(),
      }

      const nextMessages = [...stateRef.current.messages, userMessage]
      setState((prev) => ({ ...prev, messages: nextMessages }))
      setError(null)
      setIsStreaming(true)

      const payload = {
        participant_slugs: stateRef.current.participantIds.map(agentIdToSlug),
        messages: toApiTurns(nextMessages),
        user_name: USER_DISPLAY_NAME,
      }

      let activeAgentMessageId: string | null = null

      try {
        await streamGroupMeeting(payload, (event) => {
          if (event.type === 'agent_start' && event.agent_slug) {
            const agentId = slugToAgentId(event.agent_slug)
            activeAgentMessageId = crypto.randomUUID()
            const agentMessage: GroupMessage = {
              id: activeAgentMessageId,
              speakerType: 'agent',
              author: event.agent_name ?? event.agent_slug,
              text: '',
              timestamp: new Date().toISOString(),
              agentId,
              agentSlug: event.agent_slug,
              streaming: true,
            }
            setState((prev) => ({
              ...prev,
              messages: [...prev.messages, agentMessage],
            }))
          }

          if (event.type === 'token' && event.content && activeAgentMessageId) {
            const messageId = activeAgentMessageId
            setState((prev) => ({
              ...prev,
              messages: prev.messages.map((message) =>
                message.id === messageId
                  ? { ...message, text: `${message.text}${event.content}` }
                  : message,
              ),
            }))
          }

          if (event.type === 'agent_done' && activeAgentMessageId) {
            const messageId = activeAgentMessageId
            setState((prev) => ({
              ...prev,
              messages: prev.messages.map((message) =>
                message.id === messageId ? { ...message, streaming: false } : message,
              ),
            }))
            activeAgentMessageId = null
          }

          if (event.type === 'error') {
            setError(event.content ?? 'Error en la reunión')
          }
        })
      } catch (streamError) {
        const message =
          streamError instanceof Error
            ? streamError.message
            : 'No se pudo conectar con la API de reunión'
        setError(
          streamError instanceof Error && streamError.message === 'Not Found'
            ? 'API sin endpoint de reunión. Reinicia la API: cd agenteia-expert && .venv/bin/uvicorn app.main:app --port 8091 --reload'
            : message,
        )
      } finally {
        setIsStreaming(false)
        activeAgentMessageId = null
      }
    },
    [isStreaming],
  )

  const participantDetails = state.participantIds.map((id) => getAgentById(id))

  return {
    state,
    participantDetails,
    isStreaming,
    error,
    sendMessage,
    setParticipants,
    deleteChat,
  }
}
