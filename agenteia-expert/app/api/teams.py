from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, status

from app.core.config import get_settings
from app.db.session import SessionDependency
from app.repositories.team_repository import TeamRepository
from app.schemas.team_schema import TeamCreate, TeamRead
from app.services.team_service import TeamService
from app.services.workspace_service import WorkspaceService

router = APIRouter(prefix="/teams", tags=["teams"])


@router.post("", response_model=TeamRead, status_code=status.HTTP_201_CREATED)
async def create_team(payload: TeamCreate, session: SessionDependency) -> TeamRead:
    repository = TeamRepository(session)
    service = TeamService(
        session,
        repository,
        WorkspaceService(Path(get_settings().workspace_root)),
    )
    return TeamRead.model_validate(await service.create(payload))


@router.get("", response_model=list[TeamRead])
async def list_teams(session: SessionDependency) -> list[TeamRead]:
    entities = await TeamRepository(session).list()
    return [TeamRead.model_validate(entity) for entity in entities]
