import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { GroupMeetingPage } from '../pages/GroupMeetingPage'

afterEach(() => {
  cleanup()
  localStorage.clear()
})

beforeEach(() => {
  localStorage.clear()
})

describe('group meeting', () => {
  it('renders whatsapp-style group chat with persistence controls', () => {
    render(
      <MemoryRouter>
        <GroupMeetingPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Reunión de equipo' })).toBeInTheDocument()
    expect(screen.getByRole('log', { name: /Mensajes del grupo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Vaciar chat/i })).toBeInTheDocument()
  })

  it('persists messages in localStorage', () => {
    const { unmount } = render(
      <MemoryRouter>
        <GroupMeetingPage />
      </MemoryRouter>,
    )
    expect(localStorage.getItem('agenteia-group-meeting-v1')).toBeTruthy()
    unmount()
  })
})
