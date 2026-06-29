import type { GroupChatRequestPayload, GroupChatStreamEvent } from '../types/groupChat'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

function parseEvents(chunk: string): GroupChatStreamEvent[] {
  const events: GroupChatStreamEvent[] = []
  for (const block of chunk.split('\n\n')) {
    const line = block.split('\n').find((entry) => entry.startsWith('data: '))
    if (!line) {
      continue
    }
    try {
      events.push(JSON.parse(line.slice(6)) as GroupChatStreamEvent)
    } catch {
      /* ignore */
    }
  }
  return events
}

export async function streamGroupMeeting(
  payload: GroupChatRequestPayload,
  onEvent: (event: GroupChatStreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const response = await fetch(`${API_BASE}/group-chat/stream`, {
    method: 'POST',
    headers: {
      Accept: 'text/event-stream',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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
      for (const event of parseEvents(`${part}\n\n`)) {
        onEvent(event)
      }
    }
  }

  if (buffer.trim()) {
    for (const event of parseEvents(`${buffer}\n\n`)) {
      onEvent(event)
    }
  }
}
