from __future__ import annotations

from functools import lru_cache

from app.core.config import Settings, get_settings
from app.services.llm_service import LLMService


@lru_cache
def get_llm_service() -> LLMService:
    settings = get_settings()
    return LLMService(
        base_url=settings.llm_base_url,
        api_key=settings.llm_api_key.get_secret_value(),
        timeout_seconds=settings.llm_request_timeout_seconds,
    )


def build_health_service(settings: Settings | None = None) -> "HealthService":
    from app.services.health_service import HealthService

    resolved = settings or get_settings()
    return HealthService(resolved, get_llm_service())
