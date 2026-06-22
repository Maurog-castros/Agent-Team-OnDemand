from __future__ import annotations

from uuid import UUID

from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, EntityMixin


class Workspace(EntityMixin, Base):
    __tablename__ = "workspaces"

    agent_id: Mapped[UUID | None] = mapped_column(ForeignKey("agents.id"))
    team_id: Mapped[UUID | None] = mapped_column(ForeignKey("teams.id"))
    kind: Mapped[str] = mapped_column(String(40), nullable=False)
    path: Mapped[str] = mapped_column(String(500), unique=True, nullable=False)
    writable: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
