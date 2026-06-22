from __future__ import annotations

from typing import Any

from sqlalchemy import JSON, Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, EntityMixin


class Tool(EntityMixin, Base):
    __tablename__ = "tools"

    name: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    tool_type: Mapped[str] = mapped_column(String(60), nullable=False)
    required_role: Mapped[str | None] = mapped_column(String(120))
    enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    config_json: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
