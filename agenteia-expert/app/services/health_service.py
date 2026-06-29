from __future__ import annotations

import time
from typing import Literal

from pydantic import BaseModel
from redis.asyncio import Redis
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.services.llm_service import LLMService

ServiceStatus = Literal["ok", "offline", "unconfigured", "degraded"]


class ServiceHealth(BaseModel):
    status: ServiceStatus
    detail: str
    latency_ms: int | None = None


class HealthDepsResponse(BaseModel):
    api: ServiceHealth
    llm: ServiceHealth
    hermes: ServiceHealth
    database: ServiceHealth
    redis: ServiceHealth


class HealthService:
    def __init__(self, settings: Settings, llm: LLMService) -> None:
        self._settings = settings
        self._llm = llm

    async def check_database(self, session: AsyncSession) -> ServiceHealth:
        started = time.perf_counter()
        try:
            await session.execute(text("SELECT 1"))
            latency_ms = int((time.perf_counter() - started) * 1000)
            return ServiceHealth(status="ok", detail="connected", latency_ms=latency_ms)
        except Exception:
            latency_ms = int((time.perf_counter() - started) * 1000)
            return ServiceHealth(status="offline", detail="unavailable", latency_ms=latency_ms)

    async def check_redis(self) -> ServiceHealth:
        started = time.perf_counter()
        client = Redis.from_url(self._settings.redis_url, decode_responses=True)
        try:
            pong = await client.ping()
            latency_ms = int((time.perf_counter() - started) * 1000)
            if pong:
                return ServiceHealth(status="ok", detail="7", latency_ms=latency_ms)
            return ServiceHealth(status="offline", detail="no_pong", latency_ms=latency_ms)
        except Exception:
            latency_ms = int((time.perf_counter() - started) * 1000)
            return ServiceHealth(status="offline", detail="unavailable", latency_ms=latency_ms)
        finally:
            await client.aclose()

    async def check_llm(self) -> ServiceHealth:
        online, latency_ms, detail = await self._llm.probe()
        if not self._llm.configured:
            return ServiceHealth(status="unconfigured", detail="LLM_API_KEY missing")
        if online:
            return ServiceHealth(status="ok", detail=detail, latency_ms=latency_ms)
        return ServiceHealth(status="offline", detail=detail, latency_ms=latency_ms)

    async def get_deps(self, session: AsyncSession) -> HealthDepsResponse:
        llm = await self.check_llm()
        database = await self.check_database(session)
        redis = await self.check_redis()
        return HealthDepsResponse(
            api=ServiceHealth(status="ok", detail="FastAPI", latency_ms=0),
            llm=llm,
            hermes=ServiceHealth(
                status=llm.status,
                detail="v1.12.3" if llm.status == "ok" else llm.detail,
                latency_ms=llm.latency_ms,
            ),
            database=database,
            redis=redis,
        )
