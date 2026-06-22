from __future__ import annotations

from fastapi import APIRouter, status

from app.db.session import SessionDependency
from app.repositories.task_repository import TaskRepository
from app.schemas.task_schema import TaskCreate, TaskRead
from app.services.task_service import TaskService

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(payload: TaskCreate, session: SessionDependency) -> TaskRead:
    repository = TaskRepository(session)
    entity = await TaskService(session, repository).create(payload)
    return TaskRead.model_validate(entity)


@router.get("", response_model=list[TaskRead])
async def list_tasks(session: SessionDependency) -> list[TaskRead]:
    entities = await TaskRepository(session).list()
    return [TaskRead.model_validate(entity) for entity in entities]
