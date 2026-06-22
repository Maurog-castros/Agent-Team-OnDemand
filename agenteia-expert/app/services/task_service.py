from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.task import Task
from app.repositories.task_repository import TaskRepository
from app.schemas.task_schema import TaskCreate


class TaskService:
    def __init__(self, session: AsyncSession, repository: TaskRepository) -> None:
        self._session = session
        self._repository = repository

    async def create(self, payload: TaskCreate) -> Task:
        task = Task(**payload.model_dump())
        async with self._session.begin():
            await self._repository.add(task)
        return task
