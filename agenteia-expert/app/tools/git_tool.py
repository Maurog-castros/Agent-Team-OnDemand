from __future__ import annotations

import asyncio
from pathlib import Path
from typing import Any

from app.tools.base_tool import BaseTool


class GitTool(BaseTool):
    name = "git"
    description = "Run read-only Git inspection commands."
    _ALLOWED = {"status", "diff", "log"}

    def __init__(self, repository: Path) -> None:
        self._repository = repository.resolve()

    async def run(self, input_data: dict[str, Any], context: dict[str, Any]) -> dict[str, Any]:
        command = str(input_data.get("command", "status"))
        if command not in self._ALLOWED:
            raise ValueError("git command is not read-only or registered")
        process = await asyncio.create_subprocess_exec(
            "git",
            "-C",
            str(self._repository),
            command,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await process.communicate()
        return {
            "exit_code": process.returncode,
            "stdout": stdout.decode("utf-8", "replace"),
            "stderr": stderr.decode("utf-8", "replace"),
        }
