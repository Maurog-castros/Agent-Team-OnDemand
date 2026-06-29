export interface ToolExecution {
  command: string
  durationMs: number
  status: 'done' | 'running' | 'error'
}

export interface PodRow {
  name: string
  ready: string
  status: string
  restarts: number
  age: string
  cpu: string
  memory: string
}

export interface DemoAction {
  label: string
}

export interface DemoChatMessage {
  id: string
  role: 'user' | 'assistant'
  author: string
  timestamp: string
  text?: string
  tools?: ToolExecution[]
  pods?: PodRow[]
  summary?: string[]
  actions?: DemoAction[]
}

export const DEMO_CHAT_MESSAGES: readonly DemoChatMessage[] = [
  {
    id: 'demo-user-1',
    role: 'user',
    author: 'Mauricio A.',
    timestamp: '2026-06-21T20:45:00-04:00',
    text: 'Necesito un resumen del estado de los pods de Kubernetes en el namespace produccion-k8s-app. Incluye status, restarts y uso de CPU/memoria.',
  },
  {
    id: 'demo-assistant-1',
    role: 'assistant',
    author: 'AgenteIA Expert',
    timestamp: '2026-06-21T20:45:12-04:00',
    tools: [
      {
        command: 'kubectl get pods -n produccion-k8s-app --namespace produccion',
        durationMs: 620,
        status: 'done',
      },
      { command: 'kubectl top pods -n produccion-k8s-app', durationMs: 412, status: 'done' },
      { command: 'kubectl describe pod -n produccion-k8s-app', durationMs: 891, status: 'done' },
    ],
    pods: [
      {
        name: 'facturacion-api-7d4f8b9c6-xk2m9',
        ready: '1/1',
        status: 'Running',
        restarts: 0,
        age: '3d',
        cpu: '45m',
        memory: '256Mi',
      },
      {
        name: 'facturacion-worker-5b8c7d6f4-pq3n1',
        ready: '1/1',
        status: 'Running',
        restarts: 1,
        age: '3d',
        cpu: '120m',
        memory: '512Mi',
      },
      {
        name: 'facturacion-redis-6f9a2b1c8-rw7k4',
        ready: '1/1',
        status: 'Running',
        restarts: 0,
        age: '7d',
        cpu: '12m',
        memory: '64Mi',
      },
    ],
    summary: [
      '3 pods en estado Running en namespace produccion-k8s-app',
      '1 restart en facturacion-worker (hace 2 días, exit 0)',
      'Uso de CPU y memoria dentro de límites normales',
      'Sin eventos Warning recientes',
    ],
    actions: [
      { label: 'Ver logs recientes' },
      { label: 'Revisar eventos' },
      { label: 'Escalar deployment' },
      { label: 'Ver HPA' },
    ],
  },
] as const
