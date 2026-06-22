from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator


class MeetingCreate(BaseModel):
    team_id: UUID
    title: str = Field(min_length=2, max_length=200)
    meeting_type: str = "daily"
    scheduled_start: datetime | None = None
    scheduled_end: datetime | None = None
    telegram_group_id: str | None = None

    @model_validator(mode="after")
    def validate_schedule(self) -> MeetingCreate:
        if (
            self.scheduled_start is not None
            and self.scheduled_end is not None
            and self.scheduled_end <= self.scheduled_start
        ):
            raise ValueError("scheduled_end must be later than scheduled_start")
        return self


class MeetingRead(MeetingCreate):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    status: str
    summary_path: str | None = None
