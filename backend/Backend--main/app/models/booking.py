from __future__ import annotations

from datetime import datetime, timedelta
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class BookingCreateRequest(BaseModel):
  service_id: str | None = Field(default=None, description="Supabase service UUID")
  service_slug: str | None = Field(default=None, description="Human-readable service identifier")
  scheduled_for: datetime
  duration_minutes: Optional[int] = Field(default=60, ge=30, le=480)
  notes: Optional[str] = Field(default=None, max_length=2000)
  metadata: dict = Field(default_factory=dict)

  @field_validator("scheduled_for")
  @classmethod
  def validate_future_date(cls, value: datetime) -> datetime:
    if value < datetime.utcnow() + timedelta(minutes=30):
      raise ValueError("Bookings must be scheduled at least 30 minutes in advance")
    return value

  @field_validator("service_id")
  @classmethod
  def require_identifier(cls, value: str | None, info):
    other = info.data.get("service_slug")
    if not value and not other:
      raise ValueError("service_id or service_slug must be provided")
    return value


class BookingResponse(BaseModel):
  booking_id: str
  status: str
