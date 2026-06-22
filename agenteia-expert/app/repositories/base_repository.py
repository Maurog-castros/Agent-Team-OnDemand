from __future__ import annotations

from typing import Generic, TypeVar
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import Base

ModelT = TypeVar("ModelT", bound=Base)


class BaseRepository(Generic[ModelT]):
    def __init__(self, session: AsyncSession, model: type[ModelT]) -> None:
        self._session = session
        self._model = model

    async def add(self, entity: ModelT) -> ModelT:
        self._session.add(entity)
        await self._session.flush()
        return entity

    async def get(self, entity_id: UUID) -> ModelT | None:
        return await self._session.get(self._model, entity_id)

    async def list(self) -> list[ModelT]:
        result = await self._session.execute(select(self._model))
        return list(result.scalars().all())
