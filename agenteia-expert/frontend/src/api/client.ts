import type {
  AgentRead,
  HealthResponse,
  MeetingRead,
  TaskRead,
  TeamRead,
} from './types'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: 'application/json',
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    let detail = response.statusText
    try {
      const body = (await response.json()) as { detail?: string }
      if (body.detail) {
        detail = body.detail
      }
    } catch {
      /* ignore parse errors */
    }
    throw new ApiError(detail, response.status)
  }

  return response.json() as Promise<T>
}

export const api = {
  health: () => request<HealthResponse>('/health'),
  listAgents: () => request<AgentRead[]>('/agents'),
  listTasks: () => request<TaskRead[]>('/tasks'),
  listTeams: () => request<TeamRead[]>('/teams'),
  getMeeting: (id: string) => request<MeetingRead>(`/meetings/${id}`),
}
