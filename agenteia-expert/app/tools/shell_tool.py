from __future__ import annotations

from typing import Any

from app.core.exceptions import ToolApprovalRequiredError
from app.tools.base_tool import BaseTool


class ShellTool(BaseTool):
    name = "shell"
    description = "Execute an approved shell command in a sandbox."

    async def run(self, input_data: dict[str, Any], context: dict[str, Any]) -> dict[str, Any]:
        raise ToolApprovalRequiredError("shell execution requires an approval workflow")
