from __future__ import annotations

from collections.abc import Callable
from typing import Any

from apscheduler.schedulers.asyncio import AsyncIOScheduler


class SchedulerService:
    def __init__(self, timezone: str) -> None:
        self._scheduler = AsyncIOScheduler(timezone=timezone)

    def add_daily(self, job_id: str, callback: Callable[..., Any], team_id: str) -> None:
        self._scheduler.add_job(
            callback,
            trigger="cron",
            id=job_id,
            replace_existing=True,
            day_of_week="mon-fri",
            hour=9,
            minute=0,
            args=[team_id],
        )

    def start(self) -> None:
        if not self._scheduler.running:
            self._scheduler.start()

    def shutdown(self) -> None:
        if self._scheduler.running:
            self._scheduler.shutdown(wait=False)
