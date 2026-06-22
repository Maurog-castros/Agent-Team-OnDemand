from __future__ import annotations

from uuid import UUID

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, EntityMixin


class MeetingMessage(EntityMixin, Base):
    __tablename__ = "meeting_messages"

    meeting_id: Mapped[UUID] = mapped_column(ForeignKey("meetings.id"), index=True, nullable=False)
    agent_id: Mapped[UUID | None] = mapped_column(ForeignKey("agents.id"))
    speaker_name: Mapped[str] = mapped_column(String(120), nullable=False)
    message_text: Mapped[str] = mapped_column(Text, nullable=False)
    message_type: Mapped[str] = mapped_column(String(40), default="statement", nullable=False)
