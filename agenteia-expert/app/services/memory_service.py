from __future__ import annotations

from pathlib import Path


class MemoryService:
    def __init__(self, workspace_root: Path) -> None:
        self._workspace_root = workspace_root.resolve()

    async def get_context_for_agent(self, agent_slug: str, team_id: str) -> dict[str, str]:
        memory_path = self._workspace_root / "agents" / agent_slug / "memory.md"
        memory = memory_path.read_text(encoding="utf-8") if memory_path.exists() else ""
        return {"agent_slug": agent_slug, "team_id": team_id, "memory": memory}

    async def save_agent_memory(self, agent_slug: str, content: str) -> None:
        memory_path = self._workspace_root / "agents" / agent_slug / "memory.md"
        memory_path.parent.mkdir(parents=True, exist_ok=True)
        memory_path.write_text(content, encoding="utf-8")
