from __future__ import annotations

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, EntityMixin


class Team(EntityMixin, Base):
    __tablename__ = "teams"

    name: Mapped[str] = mapped_column(String(120), nullable=False)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    owner_user_id: Mapped[str] = mapped_column(String(120), nullable=False)
    telegram_group_id: Mapped[str | None] = mapped_column(String(120))
    shared_workspace_path: Mapped[str] = mapped_column(String(500), nullable=False)
