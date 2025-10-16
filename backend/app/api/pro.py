from fastapi import APIRouter, HTTPException

from ..models.schemas import KycUpdateRequest
from ..services.store import store

router = APIRouter()


@router.post("/kyc")
async def update_kyc(payload: KycUpdateRequest):
    professional = store.professionals.get(payload.professional_id)
    if not professional:
        raise HTTPException(status_code=404, detail="Professional not found")

    professional.documents.append({"type": payload.type, "url": payload.url})
    if payload.kyc_status:
        professional.kyc_status = payload.kyc_status
    return {"ok": True, "professional": professional}
