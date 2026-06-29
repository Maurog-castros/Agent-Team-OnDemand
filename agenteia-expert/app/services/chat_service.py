from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents import (
    AgenteIAExpert,
    DesarrolladorFullStack,
    DevOpsArquitectoSoluciones,
    ScrumMasterProjectManager,
)
from app.agents.base_agent import BaseAgent
from app.core.config import Settings
from app.repositories.agent_repository import AgentRepository

_BUILTIN_AGENTS: dict[str, type[BaseAgent]] = {
    AgenteIAExpert.slug: AgenteIAExpert,
    DesarrolladorFullStack.slug: DesarrolladorFullStack,
    DevOpsArquitectoSoluciones.slug: DevOpsArquitectoSoluciones,
    ScrumMasterProjectManager.slug: ScrumMasterProjectManager,
}


@dataclass(frozen=True)
class ResolvedAgent:
    slug: str
    system_prompt: str
    model: str


def normalize_agent_slug(slug: str) -> str:
    return slug.strip().lower().replace("_", "-")


class ChatService:
    def __init__(self, settings: Settings, prompt_root: Path | None = None) -> None:
        self._settings = settings
        self._prompt_root = prompt_root or Path(__file__).resolve().parents[1] / "prompts"

    async def resolve_agent(self, slug: str, session: AsyncSession) -> ResolvedAgent:
        normalized = normalize_agent_slug(slug)
        try:
            entity = await AgentRepository(session).get_by_slug(normalized)
        except SQLAlchemyError:
            entity = None

        if entity is not None:
            return ResolvedAgent(
                slug=normalized,
                system_prompt=entity.system_prompt,
                model=entity.llm_model or self._settings.default_model,
            )

        builtin = _BUILTIN_AGENTS.get(normalized)
        if builtin is not None:
            agent = builtin()
            return ResolvedAgent(
                slug=normalized,
                system_prompt=agent.load_prompt(self._prompt_root),
                model=self._settings.default_model,
            )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent not found: {slug}",
        )

    def build_llm_messages(
        self,
        resolved: ResolvedAgent,
        messages: list[dict[str, str]],
    ) -> list[dict[str, str]]:
        return [{"role": "system", "content": resolved.system_prompt}, *messages]
