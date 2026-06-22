import { Link } from 'react-router-dom'

import { useApiConnection, useAgents, useTasks } from '../api/hooks'
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
  const agents = useAgents()
  const tasks = useTasks()

  const agentCount = agents.data?.length ?? AGENTS.length
  const openTasks =
    tasks.data?.filter((task) => task.status === 'open').length ??
    TASK_SEEDS.filter((task) => task.status === 'open').length
  const nextMeeting = MEETING_TIMELINE.find((item) => item.status === 'scheduled')

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Vista general del control plane AgenteIA Expert."
      />

      {apiError ? <ErrorBanner message={`API: ${apiError}. Mostrando datos locales.`} /> : null}

      <div className={styles.grid}>
        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Estado API</h2>
          <StatusBadge
            label={connected ? 'Saludable' : 'Desconectada'}
            variant={connected ? 'success' : 'warning'}
          />
          <p className={styles.cardMeta}>
            Health: {health?.status ?? '—'} · Gateway LLM: auto-hermes (ia.iamiko.cl)
          </p>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Agentes</h2>
          <p className={styles.stat}>{agentCount}</p>
          <p className={styles.cardMeta}>Profiles Hermes registrados</p>
          <Link className={styles.cardLink} to="/agents">
            Ver agentes
          </Link>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Tareas abiertas</h2>
          <p className={styles.stat}>{openTasks}</p>
          {tasks.loading ? <LoadingState label="Sincronizando tareas…" /> : null}
          <Link className={styles.cardLink} to="/tasks">
            Ver tareas
          </Link>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Próxima reunión</h2>
          {nextMeeting ? (
            <>
              <p className={styles.cardHighlight}>{nextMeeting.title}</p>
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
          <Link className={styles.cardLink} to="/meetings">
            Timeline de reuniones
          </Link>
        </article>
      </div>

      <section className={styles.section} aria-labelledby="agents-overview">
        <h2 id="agents-overview" className={styles.sectionTitle}>
          Equipo de agentes
        </h2>
        <ul className={styles.agentList}>
          {AGENTS.map((agent) => (
            <li key={agent.id} className={styles.agentItem}>
              <span className={styles.agentName}>{agent.name}</span>
              <span className={styles.agentRole}>{agent.role}</span>
              <StatusBadge label={agent.llmModel} variant="info" />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
