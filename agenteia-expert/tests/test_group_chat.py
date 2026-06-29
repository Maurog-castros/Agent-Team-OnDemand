from __future__ import annotations

from collections.abc import AsyncIterator
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


async def _fake_stream() -> AsyncIterator[str]:
    for token in ["Hola", " ", "equipo"]:
        yield token


@pytest.mark.asyncio
async def test_group_chat_streams_agent_events() -> None:
    mock_llm = MagicMock()
    mock_llm.configured = True
    mock_llm.stream_chat = lambda *_args, **_kwargs: _fake_stream()

    with patch("app.api.group_chat.get_llm_service", return_value=mock_llm):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post(
                "/group-chat/stream",
                json={
                    "participant_slugs": ["agenteia-expert", "devops-arquitecto"],
                    "messages": [
                        {
                            "author": "Mauricio A.",
                            "speaker_type": "user",
                            "content": "¿Cómo va el despliegue?",
                        }
                    ],
                },
            )

    assert response.status_code == 200
    text = response.text
    assert '"type":"agent_start"' in text
    assert '"type":"token"' in text
    assert '"type":"done"' in text


@pytest.mark.asyncio
async def test_group_chat_requires_llm_api_key() -> None:
    mock_llm = AsyncMock()
    mock_llm.configured = False

    with patch("app.api.group_chat.get_llm_service", return_value=mock_llm):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post(
                "/group-chat/stream",
                json={
                    "participant_slugs": ["agenteia-expert", "devops-arquitecto"],
                    "messages": [
                        {
                            "author": "Mauricio A.",
                            "speaker_type": "user",
                            "content": "Hola",
                        }
                    ],
                },
            )

    assert response.status_code == 503
