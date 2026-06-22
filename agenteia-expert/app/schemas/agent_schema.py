from __future__ import annotations

from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

Slug = Annotated[str, Field(pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$", max_length=80)]


class AgentCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    slug: Slug
    role: str = Field(min_length=2, max_length=120)
    description: str = ""
    system_prompt: str = Field(min_length=20)
    telegram_bot_token_env_name: str | None = None
    workspace_path: str
    shared_workspace_path: str
    llm_model: str = "auto-hermes"
    llm_provider: str = "openai_compatible"
    status: str = "inactive"


class AgentRead(AgentCreate):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
