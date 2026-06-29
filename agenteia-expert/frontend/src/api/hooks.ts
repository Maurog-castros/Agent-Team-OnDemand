import { useCallback, useEffect, useRef, useState } from 'react'

import { api, ApiError } from './client'
import type {
  AgentRead,
  ApiConnectionState,
  HealthDepsResponse,
  TaskRead,
  TeamRead,
} from './types'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

const EMPTY_AGENTS: AgentRead[] = []
const EMPTY_TASKS: TaskRead[] = []
const EMPTY_TEAMS: TeamRead[] = []

function formatError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'Error desconocido'
}

function useAsyncData<T>(loader: () => Promise<T>, fallback: T): AsyncState<T> {
  const fallbackRef = useRef(fallback)
  fallbackRef.current = fallback

  const [state, setState] = useState<AsyncState<T>>({
    data: fallback,
    loading: true,
    error: null,
  })

  useEffect(() => {
    let active = true

    void (async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      try {
        const data = await loader()
        if (active) {
          setState({ data, loading: false, error: null })
        }
      } catch (error) {
        if (active) {
          setState((prev) => ({
            data: prev.data ?? fallbackRef.current,
            loading: false,
            error: formatError(error),
          }))
        }
      }
    })()

    return () => {
      active = false
    }
  }, [loader])

  return state
}

export function useApiConnection(): ApiConnectionState & { reload: () => void } {
  const [state, setState] = useState<ApiConnectionState>({
    connected: false,
    health: null,
    error: null,
  })

  const reload = useCallback(async () => {
    try {
      const health = await api.health()
      setState({ connected: health.status === 'ok', health, error: null })
    } catch (error) {
      setState({
        connected: false,
        health: null,
        error: formatError(error),
      })
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  return { ...state, reload }
}

export function useAgents(fallback: AgentRead[] = EMPTY_AGENTS) {
  const load = useCallback(() => api.listAgents(), [])
  return useAsyncData(load, fallback)
}

export function useTasks(fallback: TaskRead[] = EMPTY_TASKS) {
  const load = useCallback(() => api.listTasks(), [])
  return useAsyncData(load, fallback)
}

export function useTeams(fallback: TeamRead[] = EMPTY_TEAMS) {
  const load = useCallback(() => api.listTeams(), [])
  return useAsyncData(load, fallback)
}

export function useHealthDeps() {
  const [state, setState] = useState<{
    data: HealthDepsResponse | null
    loading: boolean
    error: string | null
  }>({
    data: null,
    loading: true,
    error: null,
  })

  const reload = useCallback(async () => {
    try {
      const data = await api.healthDeps()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: null, loading: false, error: formatError(error) })
    }
  }, [])

  useEffect(() => {
    void reload()
    const interval = window.setInterval(() => {
      void reload()
    }, 30_000)
    return () => window.clearInterval(interval)
  }, [reload])

  return { ...state, reload }
}
