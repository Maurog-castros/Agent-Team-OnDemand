import { useApiConnection } from '../api/hooks'
import {
  ErrorBanner,
  PageHeader,
  StatusBadge,
} from '../components/common/StatusBadge'
import styles from './SystemPage.module.css'

const OBSERVABILITY_CHECKS = [
  { name: 'FastAPI /health', endpoint: '/api/health', critical: true },
  { name: 'PostgreSQL', endpoint: 'postgres:5432', critical: true },
  { name: 'Redis', endpoint: 'redis:6379', critical: true },
  { name: 'LLM Gateway', endpoint: 'https://ia.iamiko.cl/v1/models', critical: false },
  {
    name: 'Hermes runtime',
    endpoint: 'profiles: default, fullstack, devops, scrum',
    critical: false,
  },
] as const

export function SystemPage() {
  const { connected, health, error, reload } = useApiConnection()

  return (
    <>
      <PageHeader
        title="Sistema y observabilidad"
        description="Estado del control plane. La API key nunca se muestra en el dashboard."
        actions={
          <button type="button" className={styles.refreshButton} onClick={() => void reload()}>
            Revalidar health
          </button>
        }
      />

      {error ? <ErrorBanner message={error} /> : null}

      <div className={styles.grid}>
        <article className={styles.card}>
          <h2 className={styles.cardTitle}>API FastAPI</h2>
          <StatusBadge
            label={connected ? 'ok' : 'offline'}
            variant={connected ? 'success' : 'danger'}
          />
          <p className={styles.meta}>Respuesta: {health?.status ?? '—'}</p>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>LLM</h2>
          <StatusBadge label="auto-hermes" variant="info" />
          <p className={styles.meta}>Provider: openai_compatible · Base: ia.iamiko.cl/v1</p>
          <p className={styles.note}>API key: configurada en servidor (no expuesta)</p>
        </article>

        <article className={styles.card}>
          <h2 className={styles.cardTitle}>Entorno</h2>
          <dl className={styles.envList}>
            <div>
              <dt>Host</dt>
              <dd>192.168.1.38 (DellVostro)</dd>
            </div>
            <div>
              <dt>Zona horaria</dt>
              <dd>America/Santiago</dd>
            </div>
            <div>
              <dt>Hermes</dt>
              <dd>v0.17.0</dd>
            </div>
          </dl>
        </article>
      </div>

      <section aria-labelledby="checks-heading">
        <h2 id="checks-heading" className={styles.sectionTitle}>
          Health checks
        </h2>
        <ul className={styles.checkList}>
          {OBSERVABILITY_CHECKS.map((check) => (
            <li key={check.name} className={styles.checkItem}>
              <span className={styles.checkName}>{check.name}</span>
              <code className={styles.checkEndpoint}>{check.endpoint}</code>
              <StatusBadge
                label={check.critical ? 'crítico' : 'informativo'}
                variant={check.critical ? 'warning' : 'neutral'}
              />
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
