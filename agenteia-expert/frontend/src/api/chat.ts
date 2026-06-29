import type { ChatStreamEvent } from './types'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

export function parseSseChunk(chunk: string): ChatStreamEvent[] {
  const events: ChatStreamEvent[] = []
  for (const block of chunk.split('\n\n')) {
    const line = block
      .split('\n')
      .find((entry) => entry.startsWith('data: '))
    if (!line) {
      continue
    }
    try {
      events.push(JSON.parse(line.slice(6)) as ChatStreamEvent)
    } catch {
      /* ignore malformed chunks */
    }
  }
  return events
}

export async function streamAgentChat(
  slug: string,
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
  onEvent: (event: ChatStreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(`${API_BASE}/agents/${encodeURIComponent(slug)}/chat`, {
    method: 'POST',
    headers: {
      Accept: 'text/event-stream',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, stream: true }),
    signal,
  })

  if (!response.ok) {
    let detail = response.statusText
    try {
      const body = (await response.json()) as { detail?: string }
      if (body.detail) {
        detail = body.detail
      }
    } catch {
      /* ignore */
    }
    throw new Error(detail)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('Streaming body unavailable')
  }

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    buffer += decoder.decode(value, { stream: true })
    const parts = buffer.split('\n\n')
    buffer = parts.pop() ?? ''
    for (const part of parts) {
      for (const event of parseSseChunk(`${part}\n\n`)) {
        onEvent(event)
      }
    }
  }

  if (buffer.trim()) {
    for (const event of parseSseChunk(`${buffer}\n\n`)) {
      onEvent(event)
    }
  }
}
