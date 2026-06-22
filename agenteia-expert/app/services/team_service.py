from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.team import Team
from app.repositories.team_repository import TeamRepository
from app.schemas.team_schema import TeamCreate
from app.services.workspace_service import WorkspaceService


class TeamService:
    def __init__(
        self,
        session: AsyncSession,
        repository: TeamRepository,
        workspaces: WorkspaceService,
    ) -> None:
        self._session = session
        self._repository = repository
        self._workspaces = workspaces

    async def create(self, payload: TeamCreate) -> Team:
        self._workspaces.create_shared_workspace(payload.slug)
        team = Team(**payload.model_dump())
        async with self._session.begin():
            await self._repository.add(team)
        return team
