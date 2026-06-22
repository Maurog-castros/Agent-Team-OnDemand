from __future__ import annotations

from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, EntityMixin


class Task(EntityMixin, Base):
    __tablename__ = "tasks"

    team_id: Mapped[UUID] = mapped_column(ForeignKey("teams.id"), index=True, nullable=False)
    assigned_to_agent_id: Mapped[UUID | None] = mapped_column(ForeignKey("agents.id"))
    created_by_agent_id: Mapped[UUID | None] = mapped_column(ForeignKey("agents.id"))
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    status: Mapped[str] = mapped_column(String(40), default="open", nullable=False)
    priority: Mapped[str] = mapped_column(String(20), default="medium", nullable=False)
    due_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    source_meeting_id: Mapped[UUID | None] = mapped_column(ForeignKey("meetings.id"))
