import { useAgents } from '../api/hooks'
import {
  ErrorBanner,
  LoadingState,
  PageHeader,
  StatusBadge,
} from '../components/common/StatusBadge'
import { AGENTS } from '../data/agents'
import styles from './AgentsPage.module.css'

function mapStatus(status: string): 'success' | 'warning' | 'neutral' | 'danger' {
  switch (status) {
    case 'active':
      return 'success'
    case 'busy':
      return 'warning'
    case 'error':
      return 'danger'
    default:
      return 'neutral'
  }
}

export function AgentsPage() {
  const { data, loading, error } = useAgents()

  return (
    <>
      <PageHeader
        title="Agentes"
        description="Catálogo de agentes con IDs estables para integración Hermes y FastAPI."
      />

      {error ? <ErrorBanner message={`API: ${error}. Mostrando catálogo local.`} /> : null}
      {loading ? <LoadingState /> : null}

      <div className={styles.grid}>
        {AGENTS.map((agent) => {
          const remote = data?.find(
            (item) => item.slug.replace(/-/g, '_') === agent.id || item.slug === agent.id,
          )
          const status = remote?.status ?? 'inactive'

          return (
            <article key={agent.id} className={styles.card} aria-labelledby={`agent-${agent.id}`}>
              <header className={styles.cardHeader}>
                <h2 id={`agent-${agent.id}`} className={styles.name}>
                  {agent.name}
                </h2>
                <StatusBadge label={status} variant={mapStatus(status)} />
              </header>
              <dl className={styles.meta}>
                <div>
                  <dt>ID</dt>
                  <dd>
                    <code>{agent.id}</code>
                  </dd>
                </div>
                <div>
                  <dt>Rol</dt>
                  <dd>{agent.role}</dd>
                </div>
                <div>
                  <dt>Profile Hermes</dt>
                  <dd>{agent.hermesProfile}</dd>
                </div>
                <div>
                  <dt>Modelo LLM</dt>
                  <dd>{remote?.llm_model ?? agent.llmModel}</dd>
                </div>
                <div>
                  <dt>Workspace</dt>
                  <dd>{agent.workspacePath}</dd>
                </div>
              </dl>
              <p className={styles.description}>{agent.description}</p>
            </article>
          )
        })}
      </div>
    </>
  )
}
