from __future__ import annotations

from collections.abc import Awaitable, Callable, Sequence

AgentTurn = Callable[[str], Awaitable[str]]


class MeetingService:
    def __init__(self, invoke_agent: AgentTurn) -> None:
        self._invoke_agent = invoke_agent

    async def run_sequential(self, agent_slugs: Sequence[str], context: str) -> list[str]:
        messages: list[str] = []
        current_context = context
        for agent_slug in agent_slugs:
            response = await self._invoke_agent(f"{agent_slug}\n{current_context}")
            messages.append(response)
            current_context = f"{current_context}\n{response}"
        return messages
