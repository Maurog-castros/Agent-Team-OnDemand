export interface HealthResponse {
  status: string
}

export type ServiceStatus = 'ok' | 'offline' | 'unconfigured' | 'degraded'

export interface ServiceHealth {
  status: ServiceStatus
  detail: string
  latency_ms: number | null
}

export interface HealthDepsResponse {
  api: ServiceHealth
  llm: ServiceHealth
  hermes: ServiceHealth
  database: ServiceHealth
  redis: ServiceHealth
}

export interface ChatMessagePayload {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatRequest {
  messages: ChatMessagePayload[]
  stream?: boolean
}

export interface ChatResponse {
  content: string
  model: string
  agent_slug: string
}

export type ChatStreamEventType = 'token' | 'done' | 'error'

export interface ChatStreamEvent {
  type: ChatStreamEventType
  content?: string
}

export interface AgentRead {
  id: string
  name: string
  slug: string
  role: string
  description: string
  status: string
  llm_model: string
  llm_provider: string
  workspace_path: string
  shared_workspace_path: string
}

export interface TaskRead {
  id: string
  team_id: string
  assigned_to_agent_id: string | null
  title: string
  description: string
  status: string
  priority: string
  due_date: string | null
}

export interface TeamRead {
  id: string
  name: string
  slug: string
  description: string
  shared_workspace_path: string
}

export interface MeetingRead {
  id: string
  team_id: string
  title: string
  meeting_type: string
  status: string
  scheduled_start: string | null
  scheduled_end: string | null
  summary_path: string | null
}

export interface ApiConnectionState {
  connected: boolean
  health: HealthResponse | null
  error: string | null
}
