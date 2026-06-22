import { describe, expect, it } from 'vitest'

import { AGENTS, DEFAULT_CHAT_AGENT, getAgentById } from '../data/agents'

describe('agents catalog', () => {
  it('includes the four stable agent ids', () => {
    const ids = AGENTS.map((agent) => agent.id)
    expect(ids).toEqual([
      'agenteia_expert',
      'desarrollador_fullstack',
      'devops_arquitecto',
      'scrum_master_pm',
    ])
  })

  it('defaults chat to agenteia_expert', () => {
    expect(DEFAULT_CHAT_AGENT).toBe('agenteia_expert')
    expect(getAgentById(DEFAULT_CHAT_AGENT).name).toBe('AgenteIA Expert')
  })
})
