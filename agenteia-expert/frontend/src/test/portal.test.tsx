import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'

import { AgentChatProvider } from '../context/AgentChatContext'
import { ChatPage } from '../pages/ChatPage'
import { MeetingsPage } from '../pages/MeetingsPage'

afterEach(() => {
  cleanup()
})

function renderChat() {
  return render(
    <MemoryRouter>
      <AgentChatProvider>
        <ChatPage />
      </AgentChatProvider>
    </MemoryRouter>,
  )
}

describe('portal views', () => {
  it('renders chat without mixing meeting timeline', () => {
    const { container } = renderChat()
    expect(screen.getByRole('heading', { name: 'AgenteIA Expert' })).toBeInTheDocument()
    expect(screen.getByRole('log', { name: /Historial de chat/i })).toBeInTheDocument()
    expect(screen.getByText('Configuración del agente')).toBeInTheDocument()
    expect(container.querySelector('[aria-label="Timeline de reuniones"]')).not.toBeInTheDocument()
  })

  it('renders meetings timeline separate from chat', () => {
    const { container } = render(
      <MemoryRouter>
        <MeetingsPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Reuniones' })).toBeInTheDocument()
    expect(screen.getByLabelText(/Timeline de reuniones/i)).toBeInTheDocument()
    expect(container.querySelector('[aria-label="Historial de chat"]')).not.toBeInTheDocument()
  })
})
