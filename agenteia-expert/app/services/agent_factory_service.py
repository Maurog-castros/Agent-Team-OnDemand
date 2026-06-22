from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.agent import Agent
from app.repositories.agent_repository import AgentRepository
from app.schemas.agent_schema import AgentCreate
from app.services.workspace_service import WorkspaceService


class AgentFactoryService:
    def __init__(
        self,
        session: AsyncSession,
        repository: AgentRepository,
        workspaces: WorkspaceService,
    ) -> None:
        self._session = session
        self._repository = repository
        self._workspaces = workspaces

    async def create(self, payload: AgentCreate) -> Agent:
        self._workspaces.create_agent_workspace(payload.slug)
        agent = Agent(**payload.model_dump())
        async with self._session.begin():
            await self._repository.add(agent)
        return agent
