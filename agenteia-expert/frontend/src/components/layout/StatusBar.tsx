import { Link } from 'react-router-dom'

import { useApiConnection, useHealthDeps } from '../../api/hooks'
import type { ServiceHealth } from '../../api/types'
import styles from './StatusBar.module.css'

interface ServiceRow {
  key: string
  name: string
  icon: string
}

const SERVICE_ROWS: ServiceRow[] = [
  { key: 'api', name: 'API', icon: '⚡' },
  { key: 'hermes', name: 'Hermes', icon: '◆' },
  { key: 'database', name: 'PostgreSQL', icon: '▣' },
  { key: 'redis', name: 'Redis', icon: '◎' },
  { key: 'llm', name: 'LLM', icon: '◇' },
]

const FALLBACK: Record<string, ServiceHealth> = {
  api: { status: 'offline', detail: 'FastAPI', latency_ms: null },
  hermes: { status: 'offline', detail: 'v1.12.3', latency_ms: null },
  database: { status: 'offline', detail: '16', latency_ms: null },
  redis: { status: 'offline', detail: '7', latency_ms: null },
  llm: { status: 'offline', detail: 'auto-hermes', latency_ms: null },
}

function formatLatency(latency: number | null): string {
  if (latency === null) {
    return '—'
  }
  return `${latency} ms`
}

function isOnline(service: ServiceHealth, apiConnected: boolean, key: string): boolean {
  if (key === 'api') {
    return apiConnected
  }
  return service.status === 'ok'
}

export function StatusBar() {
  const { connected } = useApiConnection()
  const { data: deps } = useHealthDeps()

  return (
    <footer className={styles.bar} aria-label="Estado del sistema">
      <div className={styles.services}>
        {SERVICE_ROWS.map((row, index) => {
          const service = deps?.[row.key as keyof typeof deps] ?? FALLBACK[row.key]
          const online = isOnline(service, connected, row.key)
          const detail = service.detail
          return (
            <div key={row.key} className={styles.service}>
              {index > 0 ? <span className={styles.divider} aria-hidden="true" /> : null}
              <span className={styles.serviceIcon} aria-hidden="true">
                {row.icon}
              </span>
              <span className={styles.serviceName}>{row.name}</span>
              <span className={styles.serviceDetail}>{detail}</span>
              <span className={online ? styles.statusOk : styles.statusWarn}>
                {online ? (
                  <>
                    <span className={styles.statusCheck} aria-hidden="true">
                      ✓
                    </span>
                    Operativo
                  </>
                ) : (
                  'Offline'
                )}
              </span>
              <span className={styles.latency}>{formatLatency(service.latency_ms)}</span>
            </div>
          )
        })}
      </div>
      <Link className={styles.detailLink} to="/system">
        Ver detalle del sistema
        <span aria-hidden="true">›</span>
      </Link>
    </footer>
  )
}
