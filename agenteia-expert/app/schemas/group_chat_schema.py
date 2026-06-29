from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class GroupChatTurn(BaseModel):
    author: str = Field(min_length=1)
    speaker_type: Literal["user", "agent"]
    content: str = Field(min_length=1)
    agent_slug: str | None = None


class GroupChatRequest(BaseModel):
    participant_slugs: list[str] = Field(min_length=2, max_length=6)
    messages: list[GroupChatTurn] = Field(min_length=1)
    user_name: str = "Mauricio A."


class GroupChatStreamEvent(BaseModel):
    type: Literal["agent_start", "token", "agent_done", "done", "error"]
    content: str = ""
    agent_slug: str | None = None
    agent_name: str | None = None
