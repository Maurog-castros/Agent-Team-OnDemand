from __future__ import annotations

from collections.abc import AsyncIterator
from typing import Protocol


class AgentRuntime(Protocol):
    def stream_chat(
        self, agent_slug: str, messages: list[dict[str, str]]
    ) -> AsyncIterator[str]: ...


class AgentRuntimeService:
    def __init__(self, runtime: AgentRuntime) -> None:
        self._runtime = runtime

    def stream_chat(self, agent_slug: str, messages: list[dict[str, str]]) -> AsyncIterator[str]:
        return self._runtime.stream_chat(agent_slug, messages)
