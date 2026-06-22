from sqlalchemy.ext.asyncio import AsyncSession

from app.models.tool import Tool
from app.repositories.base_repository import BaseRepository


class ToolRepository(BaseRepository[Tool]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Tool)
