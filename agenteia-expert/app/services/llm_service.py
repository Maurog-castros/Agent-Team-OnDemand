from __future__ import annotations

from typing import Any

import httpx
import structlog

from app.core.exceptions import ExternalServiceUnavailableError


class LLMService:
    def __init__(self, base_url: str, api_key: str, timeout_seconds: float = 120) -> None:
        self._base_url = base_url.rstrip("/")
        self._api_key = api_key
        self._timeout = timeout_seconds
        self._logger = structlog.get_logger(__name__)

    async def chat(
        self,
        agent_slug: str,
        messages: list[dict[str, str]],
        model: str = "auto-hermes",
        tools: list[dict[str, Any]] | None = None,
    ) -> str:
        payload: dict[str, Any] = {"model": model, "messages": messages}
        if tools:
            payload["tools"] = tools
        headers = {"Authorization": f"Bearer {self._api_key}"}
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                response = await client.post(
                    f"{self._base_url}/chat/completions", headers=headers, json=payload
                )
                response.raise_for_status()
        except (httpx.HTTPError, TimeoutError) as exc:
            self._logger.exception("llm.error", agent_slug=agent_slug, model=model)
            raise ExternalServiceUnavailableError("LLM provider unavailable") from exc
        body = response.json()
        return str(body["choices"][0]["message"]["content"])
