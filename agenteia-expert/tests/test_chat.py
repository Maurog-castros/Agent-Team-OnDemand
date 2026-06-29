from __future__ import annotations

from collections.abc import AsyncIterator
from unittest.mock import AsyncMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


async def _fake_stream() -> AsyncIterator[str]:
    for token in ["Hola", " ", "mundo"]:
        yield token


@pytest.mark.asyncio
async def test_chat_returns_json_when_not_streaming() -> None:
    mock_llm = AsyncMock()
    mock_llm.configured = True
    mock_llm.chat = AsyncMock(return_value="Respuesta demo")

    with patch("app.api.chat.get_llm_service", return_value=mock_llm):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post(
                "/agents/agenteia-expert/chat",
                json={
                    "messages": [{"role": "user", "content": "Hola"}],
                    "stream": False,
                },
            )

    assert response.status_code == 200
    body = response.json()
    assert body["content"] == "Respuesta demo"
    assert body["agent_slug"] == "agenteia-expert"


@pytest.mark.asyncio
async def test_chat_streams_sse_tokens() -> None:
    mock_llm = AsyncMock()
    mock_llm.configured = True
    mock_llm.stream_chat = lambda *_args, **_kwargs: _fake_stream()

    with patch("app.api.chat.get_llm_service", return_value=mock_llm):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post(
                "/agents/agenteia_expert/chat",
                json={
                    "messages": [{"role": "user", "content": "Hola"}],
                    "stream": True,
                },
            )

    assert response.status_code == 200
    text = response.text
    assert '"type":"token"' in text
    assert '"content":"Hola"' in text
    assert '"type":"done"' in text


@pytest.mark.asyncio
async def test_chat_requires_llm_api_key() -> None:
    mock_llm = AsyncMock()
    mock_llm.configured = False

    with patch("app.api.chat.get_llm_service", return_value=mock_llm):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post(
                "/agents/agenteia-expert/chat",
                json={
                    "messages": [{"role": "user", "content": "Hola"}],
                    "stream": False,
                },
            )

    assert response.status_code == 503


@pytest.mark.asyncio
async def test_health_deps_endpoint() -> None:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health/deps")

    assert response.status_code == 200
    body = response.json()
    assert body["api"]["status"] == "ok"
    assert "llm" in body
    assert "database" in body
