from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class McpServerDefinition:
    name: str
    command: tuple[str, ...]
    enabled: bool = False


class McpRegistry:
    def __init__(self, servers: tuple[McpServerDefinition, ...] = ()) -> None:
        self._servers = {server.name: server for server in servers}

    def enabled(self) -> tuple[McpServerDefinition, ...]:
        return tuple(server for server in self._servers.values() if server.enabled)
