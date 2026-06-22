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
  workspacePath: string
}

export const AGENTS: readonly AgentDefinition[] = [
  {
    id: 'agenteia_expert',
    name: 'AgenteIA Expert',
    role: 'Root Agent',
    description: 'Coordinador principal del equipo de agentes autónomos.',
    hermesProfile: 'default',
    llmModel: 'auto-hermes',
    workspacePath: 'workspaces/agents/agenteia_expert',
  },
  {
    id: 'desarrollador_fullstack',
    name: 'Desarrollador FullStack',
    role: 'Developer',
    description: 'Implementación de features, APIs y componentes frontend.',
    hermesProfile: 'fullstack',
    llmModel: 'auto-hermes',
    workspacePath: 'workspaces/agents/desarrollador_fullstack',
  },
  {
    id: 'devops_arquitecto',
    name: 'DevOps Arquitecto Soluciones',
    role: 'DevOps',
    description: 'Infraestructura, CI/CD, Docker y despliegues K3s.',
    hermesProfile: 'devops',
    llmModel: 'auto-hermes',
    workspacePath: 'workspaces/agents/devops_arquitecto',
  },
  {
    id: 'scrum_master_pm',
    name: 'Scrum Master / PM',
    role: 'Scrum Master',
    description: 'Facilitación de dailies, backlog y seguimiento de tareas.',
    hermesProfile: 'scrum',
    llmModel: 'auto-hermes',
    workspacePath: 'workspaces/agents/scrum_master_pm',
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
