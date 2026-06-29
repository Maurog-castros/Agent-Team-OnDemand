from __future__ import annotations

from collections.abc import AsyncIterator

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse

from app.api.deps import get_llm_service
from app.core.config import get_settings
from app.core.exceptions import ExternalServiceUnavailableError
from app.db.session import SessionDependency
from app.schemas.chat_schema import ChatRequest, ChatResponse, ChatStreamEvent
from app.services.chat_service import ChatService

router = APIRouter(prefix="/agents", tags=["chat"])


def _serialize_event(event: ChatStreamEvent) -> str:
    return f"data: {event.model_dump_json()}\n\n"


@router.post("/{slug}/chat", response_model=None)
async def chat_with_agent(
    slug: str,
    payload: ChatRequest,
    session: SessionDependency,
) -> ChatResponse | StreamingResponse:
    settings = get_settings()
    llm = get_llm_service()
    if not llm.configured:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="LLM_API_KEY is not configured",
        )

    chat_service = ChatService(settings)
    resolved = await chat_service.resolve_agent(slug, session)
    llm_messages = chat_service.build_llm_messages(
        resolved,
        [message.model_dump() for message in payload.messages],
    )

    if payload.stream:

        async def event_stream() -> AsyncIterator[str]:
            try:
                async for token in llm.stream_chat(resolved.slug, llm_messages, resolved.model):
                    yield _serialize_event(ChatStreamEvent(type="token", content=token))
                yield _serialize_event(ChatStreamEvent(type="done"))
            except ExternalServiceUnavailableError as exc:
                yield _serialize_event(ChatStreamEvent(type="error", content=str(exc)))

        return StreamingResponse(event_stream(), media_type="text/event-stream")

    try:
        content = await llm.chat(resolved.slug, llm_messages, resolved.model)
    except ExternalServiceUnavailableError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc

    return ChatResponse(content=content, model=resolved.model, agent_slug=resolved.slug)
