from fastapi import APIRouter, HTTPException

from ..models.schemas import TermsResponse, TermsAcceptRequest
from ..services.store import store

router = APIRouter()


@router.get("/terms", response_model=TermsResponse)
async def latest_terms() -> TermsResponse:
    terms = store.latest_terms()
    return TermsResponse(version=terms.version, published_at=terms.created_at, content=terms.content)


@router.post("/accept")
async def accept_terms(payload: TermsAcceptRequest):
    if payload.version != store.latest_terms().version:
        raise HTTPException(status_code=400, detail="Version mismatch")
    store.record_acceptance(
        user_id=payload.user_id,
        account_type=payload.account_type,
        version=payload.version,
        accepted_at=store.latest_terms().created_at,
        accepted_ip="api",
        user_agent="api",
    )
    return {"ok": True}
