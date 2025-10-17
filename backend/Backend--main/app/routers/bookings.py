from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from ..core.audit import record_audit_event
from ..core.rate_limit import limiter
from ..core.supabase import get_service_client
from ..dependencies import auth
from ..models.booking import BookingCreateRequest, BookingResponse

router = APIRouter(prefix="/bookings", tags=["bookings"])

supabase: Client = get_service_client()


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def create_booking(payload: BookingCreateRequest, user=Depends(auth.require_client)):
  client_id = user.get("sub")

  service_id = payload.service_id
  if not service_id and payload.service_slug:
    lookup = (
      supabase.table("services")
      .select("id", "slug")
      .eq("slug", payload.service_slug)
      .limit(1)
      .execute()
    )
    if lookup.error or not lookup.data:
      raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unknown service slug")
    service_id = lookup.data[0]["id"]

  if not service_id:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Service selection required")

  data = {
    "client_id": client_id,
    "service_id": service_id,
    "scheduled_for": payload.scheduled_for.isoformat(),
    "duration_minutes": payload.duration_minutes,
    "notes": payload.notes,
    "metadata": {**payload.metadata, "source": "web"},
  }

  response = supabase.table("bookings").insert(data).execute()
  if response.error:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=response.error.message)

  record = response.data[0]

  record_audit_event(
    actor_id=client_id,
    action="booking.created",
    resource_type="booking",
    resource_id=record.get("id"),
    new_values={
      "service_id": service_id,
      "scheduled_for": payload.scheduled_for.isoformat(),
      "duration_minutes": payload.duration_minutes,
    },
  )

  return BookingResponse(booking_id=record["id"], status=record["status"])
