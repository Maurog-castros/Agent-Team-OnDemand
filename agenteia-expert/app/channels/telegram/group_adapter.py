from app.channels.telegram.bot_adapter import TelegramBotAdapter


class TelegramGroupAdapter:
    def __init__(self, bot: TelegramBotAdapter, group_id: str) -> None:
        self._bot = bot
        self._group_id = group_id

    async def publish(self, text: str) -> None:
        await self._bot.send(self._group_id, text)
