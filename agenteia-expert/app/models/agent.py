from __future__ import annotations

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, EntityMixin


class Agent(EntityMixin, Base):
    __tablename__ = "agents"

    name: Mapped[str] = mapped_column(String(120), nullable=False)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True, nullable=False)
    role: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    system_prompt: Mapped[str] = mapped_column(Text, nullable=False)
    telegram_bot_token_env_name: Mapped[str | None] = mapped_column(String(120))
    workspace_path: Mapped[str] = mapped_column(String(500), nullable=False)
    shared_workspace_path: Mapped[str] = mapped_column(String(500), nullable=False)
    llm_model: Mapped[str] = mapped_column(String(120), default="auto-hermes", nullable=False)
    llm_provider: Mapped[str] = mapped_column(
        String(80), default="openai_compatible", nullable=False
    )
    status: Mapped[str] = mapped_column(String(40), default="inactive", nullable=False)
