from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str = Field(min_length=1)


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(min_length=1)
    stream: bool = True


class ChatResponse(BaseModel):
    content: str
    model: str
    agent_slug: str


class ChatStreamEvent(BaseModel):
    type: Literal["token", "done", "error"]
    content: str = ""
