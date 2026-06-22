from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.meeting import Meeting
from app.repositories.meeting_repository import MeetingRepository
from app.schemas.meeting_schema import MeetingCreate


class MeetingCrudService:
    def __init__(self, session: AsyncSession, repository: MeetingRepository) -> None:
        self._session = session
        self._repository = repository

    async def create(self, payload: MeetingCreate) -> Meeting:
        meeting = Meeting(**payload.model_dump(), status="scheduled")
        async with self._session.begin():
            await self._repository.add(meeting)
        return meeting
