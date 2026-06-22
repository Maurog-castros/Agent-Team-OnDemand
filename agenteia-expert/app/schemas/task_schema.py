from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class TaskCreate(BaseModel):
    team_id: UUID
    assigned_to_agent_id: UUID | None = None
    created_by_agent_id: UUID | None = None
    title: str = Field(min_length=2, max_length=200)
    description: str = ""
    status: str = "open"
    priority: str = "medium"
    due_date: datetime | None = None
    source_meeting_id: UUID | None = None


class TaskRead(TaskCreate):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
