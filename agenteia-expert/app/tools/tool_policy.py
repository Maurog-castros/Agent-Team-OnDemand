from __future__ import annotations

from dataclasses import dataclass

from app.core.exceptions import ToolApprovalRequiredError, ToolPermissionDeniedError


@dataclass(frozen=True, slots=True)
class RolePolicy:
    allow: frozenset[str]
    require_approval: frozenset[str]


class ToolPolicy:
    def __init__(self, policies: dict[str, RolePolicy]) -> None:
        self._policies = policies

    def authorize(self, role: str, action: str) -> None:
        policy = self._policies.get(role)
        if policy is None:
            raise ToolPermissionDeniedError(f"role has no policy: {role}")
        if action in policy.require_approval:
            raise ToolApprovalRequiredError(f"action requires approval: {action}")
        if action not in policy.allow:
            raise ToolPermissionDeniedError(f"action denied: {action}")
