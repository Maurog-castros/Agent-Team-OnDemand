from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import agents, chat, group_chat, health, meetings, tasks, teams
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
    application.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:8080",
            "http://localhost:8081",
            "https://team.maurocastro.cl",
            "http://team.maurocastro.cl",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    application.include_router(health.router)
    application.include_router(chat.router)
    application.include_router(group_chat.router)
    application.include_router(agents.router)
    application.include_router(teams.router)
    application.include_router(meetings.router)
    application.include_router(tasks.router)
    application.include_router(web_router)
    return application


app = create_app()
