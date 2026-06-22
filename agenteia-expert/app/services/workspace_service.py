from __future__ import annotations

from pathlib import Path


class WorkspaceService:
    PERSONAL_FILES = ("memory.md", "notes.md", "tasks.md", "decisions.md", "tools.md")

    def __init__(self, root: Path) -> None:
        self._root = root.resolve()

    def create_agent_workspace(self, agent_slug: str) -> Path:
        workspace = self._safe_path("agents", agent_slug)
        workspace.mkdir(parents=True, exist_ok=True)
        (workspace / "artifacts").mkdir(exist_ok=True)
        for filename in self.PERSONAL_FILES:
            (workspace / filename).touch(exist_ok=True)
        return workspace

    def create_shared_workspace(self, project_slug: str) -> Path:
        workspace = self._safe_path("shared", project_slug)
        for directory in ("meetings", "decisions", "architecture", "tasks", "artifacts"):
            (workspace / directory).mkdir(parents=True, exist_ok=True)
        for filename in ("README.md", "backlog.md"):
            (workspace / filename).touch(exist_ok=True)
        return workspace

    def _safe_path(self, category: str, slug: str) -> Path:
        allowed_characters = "abcdefghijklmnopqrstuvwxyz0123456789-"
        if not slug or any(character not in allowed_characters for character in slug):
            raise ValueError("workspace slug contains unsupported characters")
        candidate = (self._root / category / slug).resolve()
        if self._root not in candidate.parents:
            raise ValueError("workspace path escapes root")
        return candidate
