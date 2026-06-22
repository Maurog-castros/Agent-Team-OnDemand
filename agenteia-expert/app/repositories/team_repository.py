from sqlalchemy.ext.asyncio import AsyncSession

from app.models.team import Team
from app.repositories.base_repository import BaseRepository


class TeamRepository(BaseRepository[Team]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Team)
