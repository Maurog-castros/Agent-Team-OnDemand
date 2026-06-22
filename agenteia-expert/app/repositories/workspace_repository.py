from sqlalchemy.ext.asyncio import AsyncSession

from app.models.workspace import Workspace
from app.repositories.base_repository import BaseRepository


class WorkspaceRepository(BaseRepository[Workspace]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Workspace)
