from __future__ import annotations

from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.agent_schema import Slug


class TeamCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    slug: Slug
    description: str = ""
    owner_user_id: str = Field(min_length=1, max_length=120)
    telegram_group_id: str | None = None
    shared_workspace_path: str


class TeamRead(TeamCreate):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
