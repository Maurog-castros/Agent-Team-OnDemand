import { useEffect, useId, useRef, useState, type FormEvent } from 'react'

import { ErrorBanner } from '../common/StatusBadge'
import type { AgentId } from '../../data/agents'
import { AGENTS } from '../../data/agents'
import { useGroupChat } from '../../hooks/useGroupChat'
import type { GroupMessage } from '../../types/groupChat'
import styles from './GroupChatView.module.css'

const AGENT_COLORS: Record<AgentId, string> = {
  agenteia_expert: '#e11d48',
  desarrollador_fullstack: '#2563eb',
  devops_arquitecto: '#d97706',
  scrum_master_pm: '#7c3aed',
}

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function formatDateLabel(iso: string): string {
  const date = new Date(iso)
  const today = new Date()
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  if (isToday) {
    return 'Hoy'
  }
  return new Intl.DateTimeFormat('es-CL', { dateStyle: 'long' }).format(date)
}

function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function shouldShowDateSeparator(messages: GroupMessage[], index: number): boolean {
  if (index === 0) {
    return true
  }
  const current = new Date(messages[index].timestamp).toDateString()
  const previous = new Date(messages[index - 1].timestamp).toDateString()
  return current !== previous
}

export function GroupChatView() {
  const {
    state,
    participantDetails,
    isStreaming,
    error,
    sendMessage,
    setParticipants,
    deleteChat,
  } = useGroupChat()
  const [draft, setDraft] = useState('')
  const [showParticipants, setShowParticipants] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputId = useId()

  useEffect(() => {
    const node = listRef.current
    if (node && typeof node.scrollTo === 'function') {
      node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' })
    }
  }, [state.messages])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text || isStreaming) {
      return
    }
    setDraft('')
    await sendMessage(text)
  }

  const toggleParticipant = (agentId: AgentId) => {
    const current = state.participantIds
    if (current.includes(agentId)) {
      if (current.length <= 2) {
        return
      }
      setParticipants(current.filter((id) => id !== agentId))
      return
    }
    setParticipants([...current, agentId])
  }

  const handleDelete = () => {
    if (window.confirm('¿Borrar todo el historial de la reunión? Esta acción no se puede deshacer.')) {
      deleteChat()
    }
  }

  return (
    <section className={styles.shell} aria-label="Chat grupal de reunión">
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <div className={styles.avatarStack} aria-hidden="true">
            {participantDetails.slice(0, 3).map((agent) => (
              <span
                key={agent.id}
                className={styles.stackAvatar}
                style={{ background: AGENT_COLORS[agent.id] }}
              >
                {initials(agent.name)}
              </span>
            ))}
          </div>
          <div>
            <h1 className={styles.title}>{state.title}</h1>
            <p className={styles.subtitle}>
              {participantDetails.map((agent) => agent.name).join(', ')}
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.headerBtn}
            onClick={() => setShowParticipants((open) => !open)}
          >
            Participantes ({state.participantIds.length})
          </button>
          <button type="button" className={styles.headerBtnDanger} onClick={handleDelete}>
            Vaciar chat
          </button>
        </div>
      </header>

      {showParticipants ? (
        <div className={styles.participantPanel}>
          {AGENTS.map((agent) => {
            const active = state.participantIds.includes(agent.id)
            return (
              <button
                key={agent.id}
                type="button"
                className={active ? `${styles.participantChip} ${styles.participantActive}` : styles.participantChip}
                onClick={() => toggleParticipant(agent.id)}
              >
                <span
                  className={styles.chipDot}
                  style={{ background: AGENT_COLORS[agent.id] }}
                  aria-hidden="true"
                />
                {agent.name}
              </button>
            )
          })}
          <p className={styles.participantHint}>Mínimo 2 agentes activos en la reunión.</p>
        </div>
      ) : null}

      {error ? (
        <div className={styles.errorWrap}>
          <ErrorBanner message={error} />
        </div>
      ) : null}

      <div ref={listRef} className={styles.messages} role="log" aria-live="polite" aria-label="Mensajes del grupo">
        {state.messages.map((message, index) => {
          const isUser = message.speakerType === 'user'
          const isSystem = message.speakerType === 'system'

          return (
            <div key={message.id}>
              {shouldShowDateSeparator(state.messages, index) ? (
                <div className={styles.dateSep}>
                  <span>{formatDateLabel(message.timestamp)}</span>
                </div>
              ) : null}

              {isSystem ? (
                <div className={styles.systemMsg}>{message.text}</div>
              ) : (
                <article
                  className={
                    isUser
                      ? `${styles.bubbleRow} ${styles.bubbleRowUser}`
                      : styles.bubbleRow
                  }
                >
                  {!isUser ? (
                    <span
                      className={styles.bubbleAvatar}
                      style={{
                        background: message.agentId
                          ? AGENT_COLORS[message.agentId]
                          : '#64748b',
                      }}
                      aria-hidden="true"
                    >
                      {initials(message.author)}
                    </span>
                  ) : null}
                  <div
                    className={
                      isUser ? `${styles.bubble} ${styles.bubbleUser}` : styles.bubble
                    }
                  >
                    {!isUser ? <span className={styles.bubbleAuthor}>{message.author}</span> : null}
                    <p className={styles.bubbleText}>
                      {message.text}
                      {message.streaming ? <span className={styles.cursor}>▍</span> : null}
                    </p>
                    <time className={styles.bubbleTime} dateTime={message.timestamp}>
                      {formatTime(message.timestamp)}
                    </time>
                  </div>
                </article>
              )}
            </div>
          )
        })}
      </div>

      <form className={styles.composer} onSubmit={handleSubmit}>
        <label className={styles.srOnly} htmlFor={`${inputId}-group-message`}>
          Mensaje para el grupo
        </label>
        <input
          id={`${inputId}-group-message`}
          className={styles.input}
          value={draft}
          placeholder="Escribe un mensaje al grupo…"
          disabled={isStreaming}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" className={styles.sendBtn} disabled={!draft.trim() || isStreaming}>
          {isStreaming ? '…' : 'Enviar'}
        </button>
      </form>
    </section>
  )
}
