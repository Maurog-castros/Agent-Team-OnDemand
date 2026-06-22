from __future__ import annotations

from typing import Protocol


class TelegramBotClient(Protocol):
    async def send_message(self, chat_id: str, text: str) -> object: ...


class TelegramBotAdapter:
    def __init__(self, client: TelegramBotClient) -> None:
        self._client = client

    async def send(self, chat_id: str, text: str) -> None:
        if not chat_id or not text.strip():
            raise ValueError("chat_id and text are required")
        await self._client.send_message(chat_id=chat_id, text=text)
