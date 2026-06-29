from __future__ import annotations

import json
import time
from collections.abc import AsyncIterator
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

    @property
    def configured(self) -> bool:
        return bool(self._api_key.strip())

    def _headers(self) -> dict[str, str]:
        return {"Authorization": f"Bearer {self._api_key}"}

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
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                response = await client.post(
                    f"{self._base_url}/chat/completions",
                    headers=self._headers(),
                    json=payload,
                )
                response.raise_for_status()
        except (httpx.HTTPError, TimeoutError) as exc:
            self._logger.exception("llm.error", agent_slug=agent_slug, model=model)
            raise ExternalServiceUnavailableError("LLM provider unavailable") from exc
        body = response.json()
        return str(body["choices"][0]["message"]["content"])

    async def stream_chat(
        self,
        agent_slug: str,
        messages: list[dict[str, str]],
        model: str = "auto-hermes",
    ) -> AsyncIterator[str]:
        payload: dict[str, Any] = {"model": model, "messages": messages, "stream": True}
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as client:
                async with client.stream(
                    "POST",
                    f"{self._base_url}/chat/completions",
                    headers=self._headers(),
                    json=payload,
                ) as response:
                    response.raise_for_status()
                    async for line in response.aiter_lines():
                        if not line.startswith("data: "):
                            continue
                        data = line[6:].strip()
                        if not data or data == "[DONE]":
                            continue
                        try:
                            chunk = json.loads(data)
                        except json.JSONDecodeError:
                            continue
                        choices = chunk.get("choices")
                        if not choices:
                            continue
                        delta = choices[0].get("delta", {}).get("content")
                        if delta:
                            yield str(delta)
        except (httpx.HTTPError, TimeoutError) as exc:
            self._logger.exception("llm.stream_error", agent_slug=agent_slug, model=model)
            raise ExternalServiceUnavailableError("LLM provider unavailable") from exc

    async def probe(self) -> tuple[bool, int | None, str]:
        if not self.configured:
            return False, None, "unconfigured"

        started = time.perf_counter()
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(
                    f"{self._base_url}/models",
                    headers=self._headers(),
                )
                latency_ms = int((time.perf_counter() - started) * 1000)
                if response.status_code == 200:
                    return True, latency_ms, "auto-hermes"
                return False, latency_ms, f"http_{response.status_code}"
        except (httpx.HTTPError, TimeoutError):
            latency_ms = int((time.perf_counter() - started) * 1000)
            return False, latency_ms, "unavailable"
