from __future__ import annotations

from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.core.exceptions import ExternalServiceUnavailableError
from app.schemas.group_chat_schema import GroupChatRequest, GroupChatStreamEvent, GroupChatTurn
from app.services.chat_service import ChatService, normalize_agent_slug
from app.services.llm_service import LLMService

AGENT_DISPLAY_NAMES: dict[str, str] = {
    "agenteia-expert": "AgenteIA Expert",
    "desarrollador-fullstack": "Desarrollador FullStack",
    "devops-arquitecto": "DevOps Arquitecto Soluciones",
    "scrum-master-pm": "Scrum Master / PM",
}

GROUP_INSTRUCTIONS = """
Estás en una reunión de equipo dentro de un chat grupal (estilo WhatsApp).
Participan otros agentes especializados y un humano. Responde SIEMPRE en español,
desde tu rol y personalidad. Sé conciso (máximo 3 párrafos cortos). Aporta tu
perspectiva única, puedes referenciar lo dicho por otros, y evita repetir lo ya cubierto
salvo para matizar o discrepar con respeto.
""".strip()


class GroupChatService:
    def __init__(self, settings: Settings, llm: LLMService) -> None:
        self._settings = settings
        self._llm = llm
        self._chat_service = ChatService(settings)

    def _display_name(self, slug: str) -> str:
        return AGENT_DISPLAY_NAMES.get(slug, slug.replace("-", " ").title())

    def _build_transcript(self, messages: list[GroupChatTurn]) -> str:
        return "\n".join(f"{message.author}: {message.content}" for message in messages)

    def _participants_line(self, slugs: list[str]) -> str:
        names = [self._display_name(slug) for slug in slugs]
        return "Participantes del grupo: " + ", ".join(names)

    async def stream_meeting(
        self,
        payload: GroupChatRequest,
        session: AsyncSession,
    ) -> AsyncIterator[GroupChatStreamEvent]:
        participants = [normalize_agent_slug(slug) for slug in payload.participant_slugs]
        transcript_messages = list(payload.messages)

        for slug in participants:
            resolved = await self._chat_service.resolve_agent(slug, session)
            display_name = self._display_name(resolved.slug)
            transcript = self._build_transcript(transcript_messages)

            system_prompt = (
                f"{resolved.system_prompt}\n\n{GROUP_INSTRUCTIONS}\n\n"
                f"{self._participants_line(participants)}\n"
                f"Tu nombre en el chat es: {display_name}."
            )
            user_prompt = (
                f"Historial del chat grupal:\n{transcript}\n\n"
                f"Ahora te toca responder como {display_name}. "
                f"Aporta tu perspectiva a la conversación."
            )
            llm_messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ]

            yield GroupChatStreamEvent(
                type="agent_start",
                agent_slug=resolved.slug,
                agent_name=display_name,
            )

            response_parts: list[str] = []
            try:
                async for token in self._llm.stream_chat(
                    resolved.slug,
                    llm_messages,
                    resolved.model,
                ):
                    response_parts.append(token)
                    yield GroupChatStreamEvent(
                        type="token",
                        content=token,
                        agent_slug=resolved.slug,
                        agent_name=display_name,
                    )
            except ExternalServiceUnavailableError as exc:
                yield GroupChatStreamEvent(type="error", content=str(exc))
                return

            full_response = "".join(response_parts).strip()
            if full_response:
                transcript_messages.append(
                    GroupChatTurn(
                        author=display_name,
                        speaker_type="agent",
                        content=full_response,
                        agent_slug=resolved.slug,
                    ),
                )

            yield GroupChatStreamEvent(
                type="agent_done",
                agent_slug=resolved.slug,
                agent_name=display_name,
            )

        yield GroupChatStreamEvent(type="done")
