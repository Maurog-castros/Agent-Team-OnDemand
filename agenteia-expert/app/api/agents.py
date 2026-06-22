from __future__ import annotations

from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, HTTPException, status

from app.core.config import get_settings
from app.db.session import SessionDependency
from app.repositories.agent_repository import AgentRepository
from app.schemas.agent_schema import AgentCreate, AgentRead
from app.services.agent_factory_service import AgentFactoryService
from app.services.workspace_service import WorkspaceService

router = APIRouter(prefix="/agents", tags=["agents"])


@router.post("", response_model=AgentRead, status_code=status.HTTP_201_CREATED)
async def create_agent(payload: AgentCreate, session: SessionDependency) -> AgentRead:
    repository = AgentRepository(session)
    service = AgentFactoryService(
        session,
        repository,
        WorkspaceService(Path(get_settings().workspace_root)),
    )
    return AgentRead.model_validate(await service.create(payload))


@router.get("", response_model=list[AgentRead])
async def list_agents(session: SessionDependency) -> list[AgentRead]:
    entities = await AgentRepository(session).list()
    return [AgentRead.model_validate(entity) for entity in entities]


@router.get("/{agent_id}", response_model=AgentRead)
async def get_agent(agent_id: UUID, session: SessionDependency) -> AgentRead:
    entity = await AgentRepository(session).get(agent_id)
    if entity is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")
    return AgentRead.model_validate(entity)
