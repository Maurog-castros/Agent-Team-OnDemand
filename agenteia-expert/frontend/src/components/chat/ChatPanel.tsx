import { useEffect, useId, useRef, useState, type FormEvent } from 'react'

import { ErrorBanner } from '../common/StatusBadge'
import { useAgentChat } from '../../context/useAgentChat'
import { getAgentById } from '../../data/agents'
import type { PodRow } from '../../data/chat-demo'
import { useLiveChat, type UiChatMessage } from '../../hooks/useLiveChat'
import styles from './ChatPanel.module.css'

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function AgentAvatar() {
  return (
    <span className={styles.agentAvatar} aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="8" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="9.5" cy="13" r="1.2" fill="currentColor" />
        <circle cx="14.5" cy="13" r="1.2" fill="currentColor" />
        <path d="M12 4v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="3" r="1.2" fill="currentColor" />
      </svg>
    </span>
  )
}

export function ChatPanel() {
  const { agentId } = useAgentChat()
  const agent = getAgentById(agentId)
  const { messages, sendMessage, isStreaming, error } = useLiveChat(agentId)
  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const inputId = useId()

  useEffect(() => {
    const node = listRef.current
    if (node && typeof node.scrollTo === 'function') {
      node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' })
    }
  }, [messages])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text || isStreaming) {
      return
    }
    setDraft('')
    await sendMessage(text)
  }

  const handleCopyPods = (pods: PodRow[]) => {
    const header = 'NAME\tREADY\tSTATUS\tRESTARTS\tAGE\tCPU\tMEMORIA'
    const rows = pods.map(
      (pod) =>
        `${pod.name}\t${pod.ready}\t${pod.status}\t${pod.restarts}\t${pod.age}\t${pod.cpu}\t${pod.memory}`,
    )
    void navigator.clipboard.writeText([header, ...rows].join('\n'))
  }

  return (
    <section className={styles.panel} aria-labelledby="chat-heading">
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <div className={styles.headerTitleRow}>
            <AgentAvatar />
            <h1 id="chat-heading" className={styles.agentName}>
              {agent.name}
            </h1>
            <span className={styles.onlineBadge}>
              <span className={styles.statusDot} aria-hidden="true" />
              En línea
            </span>
          </div>
          <div className={styles.headerMeta}>
            <span className={styles.metaLabel}>Modelo:</span>
            <code className={styles.metaValue}>{agent.llmModel}</code>
            <span className={styles.metaSep} aria-hidden="true">
              ·
            </span>
            <span className={styles.metaLabel}>Proveedor:</span>
            <code className={styles.metaValue}>{agent.llmProvider}</code>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.headerBtn} aria-label="Ajustes del chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 12h4M18 16h4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button type="button" className={styles.headerBtn} aria-label="Información del agente">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className={styles.headerBtn} aria-label="Más opciones">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="6" cy="12" r="1.5" fill="currentColor" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              <circle cx="18" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </button>
        </div>
      </header>

      {error ? (
        <div className={styles.errorBannerWrap}>
          <ErrorBanner message={error} />
        </div>
      ) : null}

      <div
        ref={listRef}
        className={styles.messages}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Historial de chat"
      >
        {messages.length === 0 ? (
          <div className={styles.emptyChat} role="status">
            <p>Escribe un mensaje para iniciar la conversación con {agent.name}.</p>
            <p className={styles.emptyHint}>Las respuestas se generan vía FastAPI y auto-hermes.</p>
          </div>
        ) : null}

        {messages.map((message: UiChatMessage) => (
          <article
            key={message.id}
            className={
              message.role === 'user' ? `${styles.message} ${styles.user}` : styles.message
            }
          >
            <header className={styles.messageHeader}>
              <span className={styles.messageAuthor}>{message.author}</span>
              <time className={styles.messageTime} dateTime={message.timestamp}>
                {formatTime(message.timestamp)}
              </time>
            </header>

            {message.text ? (
              <p className={styles.messageText}>
                {message.text}
                {message.streaming ? <span className={styles.streamCursor}>▍</span> : null}
              </p>
            ) : message.streaming ? (
              <p className={styles.messageText}>
                <span className={styles.streamCursor}>▍</span>
              </p>
            ) : null}

            {message.tools ? (
              <details className={styles.toolBlock} open>
                <summary className={styles.toolSummary}>
                  <span className={styles.toolChevron} aria-hidden="true">
                    ▾
                  </span>
                  Ejecutando herramientas
                  <span className={styles.toolCount}>{message.tools.length}</span>
                </summary>
                <ul className={styles.toolList}>
                  {message.tools.map((tool) => (
                    <li key={tool.command} className={styles.toolItem}>
                      <span className={styles.toolCheck} aria-hidden="true">
                        ✓
                      </span>
                      <code className={styles.toolCmd}>{tool.command}</code>
                      <span className={styles.toolStatus}>Completado</span>
                      <span className={styles.toolMs}>{tool.durationMs} ms</span>
                    </li>
                  ))}
                </ul>
              </details>
            ) : null}

            {message.pods ? (
              <div className={styles.dataBlock}>
                <div className={styles.dataBlockHeader}>
                  <span className={styles.dataBlockTitle}>Pods · produccion-k8s-app</span>
                  <button
                    type="button"
                    className={styles.copyBtn}
                    onClick={() => handleCopyPods(message.pods!)}
                  >
                    Copiar
                  </button>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <caption className={styles.srOnly}>Estado de pods</caption>
                    <thead>
                      <tr>
                        <th scope="col">NAME</th>
                        <th scope="col">READY</th>
                        <th scope="col">STATUS</th>
                        <th scope="col">RESTARTS</th>
                        <th scope="col">AGE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {message.pods.map((pod) => (
                        <tr key={pod.name}>
                          <td>
                            <code>{pod.name}</code>
                          </td>
                          <td>{pod.ready}</td>
                          <td>
                            <span className={styles.badgeRunning}>{pod.status}</span>
                          </td>
                          <td>{pod.restarts}</td>
                          <td>{pod.age}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={styles.resourceSection}>
                  <div className={styles.resourceHeader}>
                    <span>CPU</span>
                    <span>MEMORIA</span>
                  </div>
                  {message.pods.map((pod) => (
                    <div key={`${pod.name}-res`} className={styles.resourceRow}>
                      <code className={styles.resourcePod}>{pod.name}</code>
                      <span>{pod.cpu}</span>
                      <span>{pod.memory}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {message.summary ? (
              <ul className={styles.summaryList}>
                {message.summary.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}

            {message.actions ? (
              <div className={styles.actions}>
                {message.actions.map((action) => (
                  <button key={action.label} type="button" className={styles.actionBtn}>
                    {action.label}
                  </button>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <form className={styles.composer} onSubmit={handleSubmit}>
        <div className={styles.composerInner}>
          <div className={styles.composerLeft}>
            <button type="button" className={styles.iconBtn} aria-label="Adjuntar archivo">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M21.44 11.05l-8.49 8.49a5.5 5.5 0 01-7.78-7.78l9.19-9.19a3.5 3.5 0 014.95 4.95l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button type="button" className={styles.iconBtn} aria-label="Comandos con barra">
              /
            </button>
            <label className={styles.srOnly} htmlFor={`${inputId}-message`}>
              Escribe un mensaje
            </label>
            <textarea
              id={`${inputId}-message`}
              className={styles.input}
              rows={2}
              value={draft}
              placeholder="Escribe tu mensaje o usa / para comandos..."
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                  event.preventDefault()
                  event.currentTarget.form?.requestSubmit()
                }
              }}
            />
          </div>
          <div className={styles.composerRight}>
            <button type="button" className={styles.toolsBtn}>
              Herramientas
              <span aria-hidden="true">▾</span>
            </button>
            <button type="submit" className={styles.sendButton} disabled={!draft.trim() || isStreaming}>
              <span>Enviar</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <kbd className={styles.sendKbd}>⌘↵</kbd>
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
