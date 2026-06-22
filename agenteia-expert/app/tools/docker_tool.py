from __future__ import annotations

from typing import Any

from app.core.exceptions import ToolApprovalRequiredError
from app.tools.base_tool import BaseTool


class DockerTool(BaseTool):
    name = "docker"
    description = "Execute an approved Docker operation."

    async def run(self, input_data: dict[str, Any], context: dict[str, Any]) -> dict[str, Any]:
        raise ToolApprovalRequiredError("Docker operations require an approval workflow")
