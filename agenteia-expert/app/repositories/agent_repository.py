from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.agent import Agent
from app.repositories.base_repository import BaseRepository


class AgentRepository(BaseRepository[Agent]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Agent)

    async def get_by_slug(self, slug: str) -> Agent | None:
        result = await self._session.execute(select(Agent).where(Agent.slug == slug))
        return result.scalar_one_or_none()
