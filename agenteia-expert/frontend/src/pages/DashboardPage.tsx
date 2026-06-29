import { Link } from 'react-router-dom'

import { useApiConnection, useAgents, useHealthDeps, useTasks } from '../api/hooks'
import {
  ErrorBanner,
  LoadingState,
  PageHeader,
  StatusBadge,
} from '../components/common/StatusBadge'
import { AGENTS } from '../data/agents'
import { MEETING_TIMELINE, TASK_SEEDS } from '../data/seed'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  const { connected, health, error: apiError } = useApiConnection()
  const { data: deps } = useHealthDeps()
  const agents = useAgents()
  const tasks = useTasks()

  const agentCount = agents.data?.length ?? AGENTS.length
  const openTasks =
    tasks.data?.filter((task) => task.status === 'open').length ??
    TASK_SEEDS.filter((task) => task.status === 'open').length
  const nextMeeting = MEETING_TIMELINE.find((item) => item.status === 'scheduled')
  const llmOnline = deps?.llm.status === 'ok'

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Vista general del control plane AgenteIA Expert."
      />

      {apiError ? <ErrorBanner message={`API: ${apiError}. Mostrando datos locales.`} /> : null}

      <div className={styles.grid}>
        <article className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Estado API</h2>
            <span className={styles.cardIcon} aria-hidden="true">
              ⚡
            </span>
          </div>
          <StatusBadge
            label={connected ? 'Operativo' : 'Desconectada'}
            variant={connected ? 'success' : 'warning'}
          />
          <p className={styles.cardMeta}>
            Health: {health?.status ?? '—'}
            {deps?.api.latency_ms != null ? ` · ${deps.api.latency_ms} ms` : ''}
          </p>
        </article>

        <article className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Gateway LLM</h2>
            <span className={styles.cardIcon} aria-hidden="true">
              ◆
            </span>
          </div>
          <StatusBadge
            label={llmOnline ? 'Operativo' : deps?.llm.status === 'unconfigured' ? 'Sin API key' : 'Offline'}
            variant={llmOnline ? 'success' : 'warning'}
          />
          <p className={styles.cardMeta}>
            auto-hermes · ia.iamiko.cl
            {deps?.llm.latency_ms != null ? ` · ${deps.llm.latency_ms} ms` : ''}
          </p>
        </article>

        <article className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Agentes</h2>
            <span className={styles.cardIcon} aria-hidden="true">
              ◎
            </span>
          </div>
          <p className={styles.stat}>{agentCount}</p>
          <p className={styles.cardMeta}>Profiles Hermes registrados</p>
          <Link className={styles.cardLink} to="/agents">
            Ver agentes →
          </Link>
        </article>

        <article className={styles.card}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Tareas abiertas</h2>
            <span className={styles.cardIcon} aria-hidden="true">
              ☑
            </span>
          </div>
          <p className={styles.stat}>{openTasks}</p>
          {tasks.loading ? <LoadingState label="Sincronizando tareas…" /> : null}
          <Link className={styles.cardLink} to="/tasks">
            Ver tareas →
          </Link>
        </article>
      </div>

      <div className={styles.lowerGrid}>
        <section className={styles.panel} aria-labelledby="agents-overview">
          <div className={styles.panelHeader}>
            <h2 id="agents-overview" className={styles.sectionTitle}>
              Equipo de agentes
            </h2>
            <Link className={styles.panelLink} to="/agents">
              Gestionar
            </Link>
          </div>
          <ul className={styles.agentList}>
            {AGENTS.map((agent) => (
              <li key={agent.id} className={styles.agentItem}>
                <div className={styles.agentMain}>
                  <span className={styles.agentAvatar} aria-hidden="true">
                    {agent.name.slice(0, 1)}
                  </span>
                  <div>
                    <span className={styles.agentName}>{agent.name}</span>
                    <span className={styles.agentRole}>{agent.role}</span>
                  </div>
                </div>
                <StatusBadge label={agent.llmModel} variant="info" />
                <span className={styles.agentStatus}>
                  <span className={styles.statusDot} aria-hidden="true" />
                  En línea
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.panel} aria-labelledby="next-meeting">
          <div className={styles.panelHeader}>
            <h2 id="next-meeting" className={styles.sectionTitle}>
              Próxima reunión
            </h2>
            <Link className={styles.panelLink} to="/meetings">
              Timeline
            </Link>
          </div>
          {nextMeeting ? (
            <>
              <p className={styles.meetingTitle}>{nextMeeting.title}</p>
              <p className={styles.cardMeta}>
                {new Intl.DateTimeFormat('es-CL', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(new Date(nextMeeting.scheduledStart))}
              </p>
            </>
          ) : (
            <p className={styles.cardMeta}>Sin reuniones programadas</p>
          )}
          <Link className={styles.cardLink} to="/chat">
            Abrir chat con agentes →
          </Link>
        </section>
      </div>
    </>
  )
}
