import { cleanup, render, screen } from '@testing-library/react'
import { RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'

import { router } from '../router'

afterEach(() => {
  cleanup()
})

describe('app shell', () => {
  it('renders dashboard on root route', async () => {
    window.history.pushState({}, '', '/')
    render(<RouterProvider router={router} />)
    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByLabelText('Navegación principal')).toBeInTheDocument()
  })
})
