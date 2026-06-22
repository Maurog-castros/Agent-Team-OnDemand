from sqlalchemy.ext.asyncio import AsyncSession

from app.models.message import MeetingMessage
from app.repositories.base_repository import BaseRepository


class MessageRepository(BaseRepository[MeetingMessage]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, MeetingMessage)
