import { PageHeader, StatusBadge } from '../components/common/StatusBadge'
import { AGENTS } from '../data/agents'
import { TOOL_POLICIES } from '../data/seed'
import styles from './ToolsPage.module.css'

function policyVariant(policy: string): 'success' | 'warning' | 'danger' {
  switch (policy) {
    case 'allow':
      return 'success'
    case 'approval':
      return 'warning'
    default:
      return 'danger'
  }
}

export function ToolsPage() {
  return (
    <>
      <PageHeader
        title="Herramientas y políticas"
        description="Matriz de permisos por tool y rol de agente. Sin secretos expuestos."
      />

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption className={styles.srOnly}>
            Políticas de herramientas por agente
          </caption>
          <thead>
            <tr>
              <th scope="col">Tool</th>
              <th scope="col">Descripción</th>
              {AGENTS.map((agent) => (
                <th key={agent.id} scope="col">
                  {agent.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOOL_POLICIES.map((entry) => (
              <tr key={entry.tool}>
                <td>
                  <code>{entry.tool}</code>
                </td>
                <td>{entry.description}</td>
                {AGENTS.map((agent) => {
                  const policy = entry.roles[agent.id] ?? entry.defaultPolicy
                  return (
                    <td key={agent.id}>
                      <StatusBadge label={policy} variant={policyVariant(policy)} />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
