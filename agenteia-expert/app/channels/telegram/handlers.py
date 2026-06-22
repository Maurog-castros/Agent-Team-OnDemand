from __future__ import annotations

from app.channels.telegram.router import TelegramCommandRouter


def build_router() -> TelegramCommandRouter:
    async def status(_: str) -> str:
        return "AgenteIA Expert está inicializando."

    return TelegramCommandRouter({"/status": status})
