import { useTasks } from '../api/hooks'
import {
  ErrorBanner,
  LoadingState,
  PageHeader,
  StatusBadge,
} from '../components/common/StatusBadge'
import { getAgentById, type AgentId } from '../data/agents'
import { TASK_SEEDS } from '../data/seed'
import styles from './TasksPage.module.css'

function priorityVariant(priority: string): 'danger' | 'warning' | 'neutral' {
  switch (priority) {
    case 'high':
      return 'danger'
    case 'medium':
      return 'warning'
    default:
      return 'neutral'
  }
}

function resolveAgentName(agentRef: string | null): string {
  if (!agentRef) {
    return 'Sin asignar'
  }
  try {
    return getAgentById(agentRef as AgentId).name
  } catch {
    return agentRef
  }
}

export function TasksPage() {
  const { data, loading, error } = useTasks()

  const tasks =
    data && data.length > 0
      ? data.map((task) => ({
          id: task.id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          assignedTo: task.assigned_to_agent_id,
        }))
      : TASK_SEEDS

  return (
    <>
      <PageHeader
        title="Tareas"
        description="Backlog operativo sincronizado con FastAPI cuando la API está disponible."
      />

      {error ? <ErrorBanner message={`API: ${error}. Mostrando seeds locales.`} /> : null}
      {loading ? <LoadingState /> : null}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption className={styles.srOnly}>Listado de tareas del equipo</caption>
          <thead>
            <tr>
              <th scope="col">Título</th>
              <th scope="col">Estado</th>
              <th scope="col">Prioridad</th>
              <th scope="col">Asignado</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>
                  <StatusBadge label={task.status} variant="info" />
                </td>
                <td>
                  <StatusBadge
                    label={task.priority}
                    variant={priorityVariant(task.priority)}
                  />
                </td>
                <td>{resolveAgentName(task.assignedTo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
