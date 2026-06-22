from __future__ import annotations

from collections.abc import Sequence
from datetime import datetime


class ScrumService:
    def render_minutes(
        self,
        title: str,
        started_at: datetime,
        participants: Sequence[str],
        statements: Sequence[str],
    ) -> str:
        participant_lines = "\n".join(f"- {participant}" for participant in participants)
        statement_lines = "\n\n".join(statements) or "Sin intervenciones."
        return (
            f"# {title}\n\n"
            f"Fecha: {started_at.isoformat()}\n\n"
            f"## Participantes\n{participant_lines}\n\n"
            f"## Avances y bloqueos\n{statement_lines}\n\n"
            "## Decisiones\n\nPendiente de cierre.\n\n"
            "## Tareas\n\nPendiente de asignación.\n"
        )
