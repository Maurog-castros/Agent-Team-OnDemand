export interface MeetingTimelineEntry {
  id: string
  title: string
  meetingType: 'daily' | 'planning' | 'review' | 'retro'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  scheduledStart: string
  facilitatorAgentId: 'scrum_master_pm' | 'agenteia_expert'
  summaryPreview: string
}

export const MEETING_TIMELINE: readonly MeetingTimelineEntry[] = [
  {
    id: 'meet-daily-001',
    title: 'Daily standup — Agent Team OnDemand',
    meetingType: 'daily',
    status: 'completed',
    scheduledStart: '2026-06-21T09:00:00-04:00',
    facilitatorAgentId: 'scrum_master_pm',
    summaryPreview: 'Se revisó el scaffold del control plane y la validación de auto-hermes.',
  },
  {
    id: 'meet-daily-002',
    title: 'Daily standup — Portal React',
    meetingType: 'daily',
    status: 'scheduled',
    scheduledStart: '2026-06-22T09:00:00-04:00',
    facilitatorAgentId: 'scrum_master_pm',
    summaryPreview: 'Agenda: revisión del portal Vite, Docker y manifiestos K3s.',
  },
  {
    id: 'meet-plan-001',
    title: 'Sprint planning — Fase portal',
    meetingType: 'planning',
    status: 'scheduled',
    scheduledStart: '2026-06-23T11:00:00-04:00',
    facilitatorAgentId: 'agenteia_expert',
    summaryPreview: 'Definir entregables de integración FastAPI y despliegue.',
  },
] as const

export interface WorkspaceEntry {
  id: string
  name: string
  kind: 'agent' | 'shared'
  path: string
  agentId?: string
  description: string
}

export const WORKSPACES: readonly WorkspaceEntry[] = [
  {
    id: 'ws-agenteia',
    name: 'AgenteIA Expert',
    kind: 'agent',
    path: 'workspaces/agents/agenteia_expert',
    agentId: 'agenteia_expert',
    description: 'Memoria, tareas, decisiones y artifacts del agente principal.',
  },
  {
    id: 'ws-fullstack',
    name: 'Desarrollador FullStack',
    kind: 'agent',
    path: 'workspaces/agents/desarrollador_fullstack',
    agentId: 'desarrollador_fullstack',
    description: 'Workspace personal del desarrollador.',
  },
  {
    id: 'ws-devops',
    name: 'DevOps Arquitecto',
    kind: 'agent',
    path: 'workspaces/agents/devops_arquitecto',
    agentId: 'devops_arquitecto',
    description: 'Infra, scripts y documentación de despliegue.',
  },
  {
    id: 'ws-scrum',
    name: 'Scrum Master / PM',
    kind: 'agent',
    path: 'workspaces/agents/scrum_master_pm',
    agentId: 'scrum_master_pm',
    description: 'Backlog operativo y minutas de reuniones.',
  },
  {
    id: 'ws-shared',
    name: 'Agent Team OnDemand',
    kind: 'shared',
    path: 'workspaces/shared/agent-team-ondemand',
    description: 'Backlog compartido, arquitectura, decisiones y minutas.',
  },
] as const

export interface ToolPolicyEntry {
  tool: string
  description: string
  defaultPolicy: 'allow' | 'deny' | 'approval'
  roles: Record<string, 'allow' | 'deny' | 'approval'>
}

export const TOOL_POLICIES: readonly ToolPolicyEntry[] = [
  {
    tool: 'file',
    description: 'Lectura y escritura de archivos en workspaces.',
    defaultPolicy: 'allow',
    roles: {
      agenteia_expert: 'allow',
      desarrollador_fullstack: 'allow',
      devops_arquitecto: 'allow',
      scrum_master_pm: 'allow',
    },
  },
  {
    tool: 'git',
    description: 'Operaciones Git en el repositorio del proyecto.',
    defaultPolicy: 'approval',
    roles: {
      agenteia_expert: 'allow',
      desarrollador_fullstack: 'allow',
      devops_arquitecto: 'approval',
      scrum_master_pm: 'deny',
    },
  },
  {
    tool: 'shell',
    description: 'Ejecución de comandos en el host.',
    defaultPolicy: 'deny',
    roles: {
      agenteia_expert: 'approval',
      desarrollador_fullstack: 'approval',
      devops_arquitecto: 'approval',
      scrum_master_pm: 'deny',
    },
  },
  {
    tool: 'docker',
    description: 'Build y gestión de contenedores.',
    defaultPolicy: 'deny',
    roles: {
      agenteia_expert: 'approval',
      desarrollador_fullstack: 'deny',
      devops_arquitecto: 'allow',
      scrum_master_pm: 'deny',
    },
  },
] as const

export interface TaskSeed {
  id: string
  title: string
  status: 'open' | 'in_progress' | 'done' | 'blocked'
  priority: 'low' | 'medium' | 'high'
  assignedTo: string | null
}

export const TASK_SEEDS: readonly TaskSeed[] = [
  {
    id: 'task-portal',
    title: 'Implementar portal React/Vite',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'desarrollador_fullstack',
  },
  {
    id: 'task-k3s',
    title: 'Preparar manifiestos K3s',
    status: 'open',
    priority: 'high',
    assignedTo: 'devops_arquitecto',
  },
  {
    id: 'task-daily',
    title: 'Configurar daily automática',
    status: 'open',
    priority: 'medium',
    assignedTo: 'scrum_master_pm',
  },
] as const
