from __future__ import annotations

from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, EntityMixin


class Meeting(EntityMixin, Base):
    __tablename__ = "meetings"

    team_id: Mapped[UUID] = mapped_column(ForeignKey("teams.id"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    meeting_type: Mapped[str] = mapped_column(String(60), default="daily", nullable=False)
    scheduled_start: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    scheduled_end: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    status: Mapped[str] = mapped_column(String(40), default="scheduled", nullable=False)
    telegram_group_id: Mapped[str | None] = mapped_column(String(120))
    summary_path: Mapped[str | None] = mapped_column(String(500))
