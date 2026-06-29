import { useCallback, useEffect, useRef, useState } from 'react'

import { streamAgentChat } from '../api/chat'
import { agentIdToSlug, getAgentById, type AgentId } from '../data/agents'
import { DEMO_CHAT_MESSAGES, type DemoChatMessage } from '../data/chat-demo'

const USE_DEMO_CHAT = import.meta.env.VITE_USE_DEMO_CHAT === 'true'

export type UiChatMessage = DemoChatMessage & { streaming?: boolean }

export function useLiveChat(agentId: AgentId) {
  const agent = getAgentById(agentId)
  const [messages, setMessages] = useState<UiChatMessage[]>(() =>
    USE_DEMO_CHAT ? [...DEMO_CHAT_MESSAGES] : [],
  )
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesRef = useRef(messages)
  messagesRef.current = messages

  useEffect(() => {
    setMessages(USE_DEMO_CHAT ? [...DEMO_CHAT_MESSAGES] : [])
    setError(null)
  }, [agentId])

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isStreaming) {
        return
      }

      const userMessage: UiChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        author: 'Mauricio A.',
        timestamp: new Date().toISOString(),
        text: trimmed,
      }
      const assistantId = crypto.randomUUID()
      const assistantMessage: UiChatMessage = {
        id: assistantId,
        role: 'assistant',
        author: agent.name,
        timestamp: new Date().toISOString(),
        text: '',
        streaming: true,
      }

      const history = [...messagesRef.current, userMessage]
        .filter((message) => message.text && !message.streaming)
        .map((message) => ({
          role: message.role,
          content: message.text!,
        }))

      setMessages((prev) => [...prev, userMessage, assistantMessage])
      setError(null)
      setIsStreaming(true)

      const controller = new AbortController()
      try {
        await streamAgentChat(
          agentIdToSlug(agentId),
          history,
          (event) => {
            if (event.type === 'token' && event.content) {
              setMessages((prev) =>
                prev.map((message) =>
                  message.id === assistantId
                    ? { ...message, text: `${message.text ?? ''}${event.content}` }
                    : message,
                ),
              )
            }
            if (event.type === 'error') {
              setError(event.content ?? 'Error de streaming')
            }
          },
          controller.signal,
        )
      } catch (streamError) {
        const message =
          streamError instanceof Error
            ? streamError.message
            : 'No se pudo conectar con la API'
        setError(message)
        setMessages((prev) => prev.filter((entry) => entry.id !== assistantId))
      } finally {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId ? { ...message, streaming: false } : message,
          ),
        )
        setIsStreaming(false)
      }
    },
    [agent.name, agentId, isStreaming],
  )

  return {
    messages,
    sendMessage,
    isStreaming,
    error,
    useDemo: USE_DEMO_CHAT,
  }
}
