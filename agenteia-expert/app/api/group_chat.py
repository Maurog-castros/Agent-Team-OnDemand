from __future__ import annotations

from collections.abc import AsyncIterator

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse

from app.api.deps import get_llm_service
from app.core.config import get_settings
from app.db.session import SessionDependency
from app.schemas.group_chat_schema import GroupChatRequest, GroupChatStreamEvent
from app.services.group_chat_service import GroupChatService

router = APIRouter(prefix="/group-chat", tags=["group-chat"])


def _serialize_event(event: GroupChatStreamEvent) -> str:
    return f"data: {event.model_dump_json()}\n\n"


@router.post("/stream", response_model=None)
async def stream_group_chat(
    payload: GroupChatRequest,
    session: SessionDependency,
) -> StreamingResponse:
    settings = get_settings()
    llm = get_llm_service()
    if not llm.configured:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="LLM_API_KEY is not configured",
        )

    service = GroupChatService(settings, llm)

    async def event_stream() -> AsyncIterator[str]:
        async for event in service.stream_meeting(payload, session):
            yield _serialize_event(event)

    return StreamingResponse(event_stream(), media_type="text/event-stream")
