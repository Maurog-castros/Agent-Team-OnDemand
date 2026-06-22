from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api import agents, health, meetings, tasks, teams
from app.channels.web.placeholder import router as web_router
from app.core.config import get_settings
from app.core.logging import configure_logging
from app.db.session import dispose_engine


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    configure_logging(settings.log_level)
    yield
    await dispose_engine()


def create_app() -> FastAPI:
    settings = get_settings()
    application = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        lifespan=lifespan,
    )
    application.include_router(health.router)
    application.include_router(agents.router)
    application.include_router(teams.router)
    application.include_router(meetings.router)
    application.include_router(tasks.router)
    application.include_router(web_router)
    return application


app = create_app()
