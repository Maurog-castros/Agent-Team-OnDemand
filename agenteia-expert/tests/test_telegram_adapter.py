import pytest

from app.channels.telegram.bot_adapter import TelegramBotAdapter


class FakeTelegramClient:
    def __init__(self) -> None:
        self.messages: list[tuple[str, str]] = []

    async def send_message(self, chat_id: str, text: str) -> object:
        self.messages.append((chat_id, text))
        return object()


@pytest.mark.asyncio
async def test_sends_message_through_injected_client() -> None:
    client = FakeTelegramClient()
    adapter = TelegramBotAdapter(client)

    await adapter.send("group-1", "Daily ready")

    assert client.messages == [("group-1", "Daily ready")]
