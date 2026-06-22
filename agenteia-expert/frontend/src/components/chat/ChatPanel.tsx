import { useId, useRef, useState, type FormEvent } from 'react'

import type { AgentId } from '../../data/agents'
import { AGENTS, DEFAULT_CHAT_AGENT, getAgentById } from '../../data/agents'
import styles from './ChatPanel.module.css'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  agentId: AgentId
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      'Hola, soy AgenteIA Expert. Este chat es independiente del timeline de reuniones. ¿En qué puedo ayudarte hoy?',
    timestamp: new Date().toISOString(),
    agentId: DEFAULT_CHAT_AGENT,
  },
]

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

interface ChatPanelProps {
  agentId?: AgentId
}

export function ChatPanel({ agentId = DEFAULT_CHAT_AGENT }: ChatPanelProps) {
  const [selectedAgent, setSelectedAgent] = useState<AgentId>(agentId)
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const inputId = useId()
  const agent = getAgentById(selectedAgent)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) {
      return
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      agentId: selectedAgent,
    }

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content:
        'Recibí tu mensaje. La integración con el runtime Hermes se conectará progresivamente vía FastAPI.',
      timestamp: new Date().toISOString(),
      agentId: selectedAgent,
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setDraft('')
    queueMicrotask(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
    })
  }

  return (
    <section className={styles.panel} aria-labelledby="chat-heading">
      <header className={styles.header}>
        <div>
          <h2 id="chat-heading" className={styles.title}>
            Chat con {agent.name}
          </h2>
          <p className={styles.subtitle}>
            Canal conversacional separado del timeline de reuniones Scrum.
          </p>
        </div>
        <label className={styles.agentSelectLabel} htmlFor={`${inputId}-agent`}>
          Agente
          <select
            id={`${inputId}-agent`}
            className={styles.agentSelect}
            value={selectedAgent}
            onChange={(event) => setSelectedAgent(event.target.value as AgentId)}
          >
            {AGENTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div
        ref={listRef}
        className={styles.messages}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Historial de chat"
      >
        {messages.map((message) => (
          <article
            key={message.id}
            className={
              message.role === 'user'
                ? `${styles.message} ${styles.messageUser}`
                : `${styles.message} ${styles.messageAssistant}`
            }
          >
            <header className={styles.messageHeader}>
              <span className={styles.messageRole}>
                {message.role === 'user' ? 'Tú' : getAgentById(message.agentId).name}
              </span>
              <time className={styles.messageTime} dateTime={message.timestamp}>
                {formatTime(message.timestamp)}
              </time>
            </header>
            <p className={styles.messageBody}>{message.content}</p>
          </article>
        ))}
      </div>

      <form className={styles.composer} onSubmit={handleSubmit}>
        <label className={styles.srOnly} htmlFor={`${inputId}-message`}>
          Escribe un mensaje
        </label>
        <textarea
          id={`${inputId}-message`}
          className={styles.input}
          rows={3}
          value={draft}
          placeholder="Escribe tu mensaje…"
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" className={styles.sendButton} disabled={!draft.trim()}>
          Enviar
        </button>
      </form>
    </section>
  )
}
