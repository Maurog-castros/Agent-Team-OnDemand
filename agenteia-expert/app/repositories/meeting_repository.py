from sqlalchemy.ext.asyncio import AsyncSession

from app.models.meeting import Meeting
from app.repositories.base_repository import BaseRepository


class MeetingRepository(BaseRepository[Meeting]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Meeting)
