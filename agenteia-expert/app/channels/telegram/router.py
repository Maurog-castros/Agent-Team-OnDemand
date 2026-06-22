from __future__ import annotations

from collections.abc import Awaitable, Callable

CommandHandler = Callable[[str], Awaitable[str]]


class TelegramCommandRouter:
    def __init__(self, handlers: dict[str, CommandHandler]) -> None:
        self._handlers = handlers

    async def dispatch(self, command: str, payload: str) -> str:
        handler = self._handlers.get(command)
        if handler is None:
            return "Comando no registrado."
        return await handler(payload)
