import { useCallback, useEffect, useState } from 'react'

import { api, ApiError } from './client'
import type {
  AgentRead,
  ApiConnectionState,
  TaskRead,
  TeamRead,
} from './types'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

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
            data: prev.data ?? fallback,
            loading: false,
            error: formatError(error),
          }))
        }
      }
    })()

    return () => {
      active = false
    }
  }, [loader, fallback])

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
    let active = true

    void (async () => {
      try {
        const health = await api.health()
        if (active) {
          setState({ connected: health.status === 'ok', health, error: null })
        }
      } catch (error) {
        if (active) {
          setState({
            connected: false,
            health: null,
            error: formatError(error),
          })
        }
      }
    })()

    return () => {
      active = false
    }
  }, [])

  return { ...state, reload }
}

export function useAgents(fallback: AgentRead[] = []) {
  return useAsyncData(() => api.listAgents(), fallback)
}

export function useTasks(fallback: TaskRead[] = []) {
  return useAsyncData(() => api.listTasks(), fallback)
}

export function useTeams(fallback: TeamRead[] = []) {
  return useAsyncData(() => api.listTeams(), fallback)
}
