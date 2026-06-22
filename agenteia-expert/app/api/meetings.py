from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, HTTPException, status

from app.db.session import SessionDependency
from app.repositories.meeting_repository import MeetingRepository
from app.schemas.meeting_schema import MeetingCreate, MeetingRead
from app.services.meeting_crud_service import MeetingCrudService

router = APIRouter(prefix="/meetings", tags=["meetings"])


@router.post("", response_model=MeetingRead, status_code=status.HTTP_201_CREATED)
async def create_meeting(payload: MeetingCreate, session: SessionDependency) -> MeetingRead:
    repository = MeetingRepository(session)
    entity = await MeetingCrudService(session, repository).create(payload)
    return MeetingRead.model_validate(entity)


@router.get("/{meeting_id}", response_model=MeetingRead)
async def get_meeting(meeting_id: UUID, session: SessionDependency) -> MeetingRead:
    entity = await MeetingRepository(session).get(meeting_id)
    if entity is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    return MeetingRead.model_validate(entity)
