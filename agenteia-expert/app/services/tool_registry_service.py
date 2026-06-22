from __future__ import annotations

from app.tools.base_tool import BaseTool


class ToolRegistryService:
    def __init__(self, tools: list[BaseTool]) -> None:
        self._tools = {tool.name: tool for tool in tools}

    def get(self, name: str) -> BaseTool | None:
        return self._tools.get(name)

    def names(self) -> tuple[str, ...]:
        return tuple(sorted(self._tools))
