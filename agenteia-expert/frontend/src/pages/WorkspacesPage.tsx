import { PageHeader, StatusBadge } from '../components/common/StatusBadge'
import { WORKSPACES } from '../data/seed'
import styles from './WorkspacesPage.module.css'

export function WorkspacesPage() {
  return (
    <>
      <PageHeader
        title="Workspaces"
        description="Workspaces personales por agente y workspace compartido del proyecto."
      />

      <div className={styles.grid}>
        {WORKSPACES.map((workspace) => (
          <article key={workspace.id} className={styles.card}>
            <header className={styles.header}>
              <h2 className={styles.title}>{workspace.name}</h2>
              <StatusBadge
                label={workspace.kind === 'shared' ? 'Compartido' : 'Agente'}
                variant={workspace.kind === 'shared' ? 'info' : 'neutral'}
              />
            </header>
            <p className={styles.path}>
              <code>{workspace.path}</code>
            </p>
            <p className={styles.description}>{workspace.description}</p>
            {workspace.agentId ? (
              <p className={styles.agentId}>
                Agente: <code>{workspace.agentId}</code>
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </>
  )
}
