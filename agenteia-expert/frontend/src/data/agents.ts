export type AgentId =
  | 'agenteia_expert'
  | 'desarrollador_fullstack'
  | 'devops_arquitecto'
  | 'scrum_master_pm'

export type AgentStatus = 'active' | 'inactive' | 'busy' | 'error'

export interface AgentDefinition {
  id: AgentId
  name: string
  role: string
  description: string
  hermesProfile: string
  llmModel: string
  llmProvider: string
  workspacePath: string
  workspaceLabel: string
  policy: string
  tools: readonly string[]
  systemPrompt: string
}

export const AGENTS: readonly AgentDefinition[] = [
  {
    id: 'agenteia_expert',
    name: 'AgenteIA Expert',
    role: 'Root Agent',
    description: 'Coordinador principal del equipo de agentes autónomos.',
    hermesProfile: 'default',
    llmModel: 'auto-hermes',
    llmProvider: 'ia.iamiko.cl',
    workspacePath: 'workspaces/agents/agenteia_expert',
    workspaceLabel: 'Producción',
    policy: 'Estándar de Operaciones',
    tools: ['kubectl', 'helm', 'logs', 'metrics', 'postgres', 'redis', 'slack', 'web'],
    systemPrompt: `Eres AgenteIA Expert, coordinador de operaciones en Kubernetes y plataformas cloud.
Responde en español con enfoque SRE: preciso, accionable y orientado a diagnóstico.
Prioriza seguridad, observabilidad y cambios reversibles.`,
  },
  {
    id: 'desarrollador_fullstack',
    name: 'Desarrollador FullStack',
    role: 'Developer',
    description: 'Implementación de features, APIs y componentes frontend.',
    hermesProfile: 'fullstack',
    llmModel: 'auto-hermes',
    llmProvider: 'ia.iamiko.cl',
    workspacePath: 'workspaces/agents/desarrollador_fullstack',
    workspaceLabel: 'Desarrollo',
    policy: 'Desarrollo seguro',
    tools: ['file', 'git', 'shell', 'web', 'postgres'],
    systemPrompt: `Eres Desarrollador FullStack del equipo AgenteIA.
Implementa features con código limpio, tests y convenciones del repositorio.`,
  },
  {
    id: 'devops_arquitecto',
    name: 'DevOps Arquitecto Soluciones',
    role: 'DevOps',
    description: 'Infraestructura, CI/CD, Docker y despliegues K3s.',
    hermesProfile: 'devops',
    llmModel: 'auto-hermes',
    llmProvider: 'ia.iamiko.cl',
    workspacePath: 'workspaces/agents/devops_arquitecto',
    workspaceLabel: 'Infraestructura',
    policy: 'Infraestructura crítica',
    tools: ['kubectl', 'helm', 'docker', 'git', 'shell', 'metrics'],
    systemPrompt: `Eres DevOps Arquitecto de Soluciones.
Diseña y opera infraestructura con Docker, K3s y pipelines CI/CD.`,
  },
  {
    id: 'scrum_master_pm',
    name: 'Scrum Master / PM',
    role: 'Scrum Master',
    description: 'Facilitación de dailies, backlog y seguimiento de tareas.',
    hermesProfile: 'scrum',
    llmModel: 'auto-hermes',
    llmProvider: 'ia.iamiko.cl',
    workspacePath: 'workspaces/agents/scrum_master_pm',
    workspaceLabel: 'Backlog',
    policy: 'Facilitación Scrum',
    tools: ['file', 'meeting', 'task', 'slack'],
    systemPrompt: `Eres Scrum Master y Project Manager del equipo.
Facilita dailies, prioriza backlog y mantiene minutas accionables.`,
  },
] as const

export const DEFAULT_CHAT_AGENT: AgentId = 'agenteia_expert'

export function getAgentById(id: AgentId): AgentDefinition {
  const agent = AGENTS.find((item) => item.id === id)
  if (!agent) {
    throw new Error(`Unknown agent id: ${id}`)
  }
  return agent
}

export function getAgentDisplayName(id: AgentId): string {
  return getAgentById(id).name
}

export function agentIdToSlug(id: AgentId): string {
  return id.replace(/_/g, '-')
}
