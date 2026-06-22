from __future__ import annotations

from pathlib import Path
from typing import Any

from app.tools.base_tool import BaseTool


class FileTool(BaseTool):
    name = "file"
    description = "Read or write files inside an assigned workspace."

    def __init__(self, workspace_root: Path) -> None:
        self._workspace_root = workspace_root.resolve()

    async def run(self, input_data: dict[str, Any], context: dict[str, Any]) -> dict[str, Any]:
        operation = str(input_data.get("operation", "read"))
        path = self._resolve(str(input_data["path"]))
        if operation == "read":
            return {"content": path.read_text(encoding="utf-8")}
        if operation == "write":
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(str(input_data.get("content", "")), encoding="utf-8")
            return {"written": True, "path": str(path)}
        raise ValueError(f"unsupported file operation: {operation}")

    def _resolve(self, relative_path: str) -> Path:
        path = (self._workspace_root / relative_path).resolve()
        if path != self._workspace_root and self._workspace_root not in path.parents:
            raise ValueError("file path escapes assigned workspace")
        return path
