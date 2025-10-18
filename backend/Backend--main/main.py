import os
import secrets
from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, validator

API_PREFIX = "/api"
DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://fixeasy.ie",
    "https://www.fixeasy.ie",
]


def _allowed_origins() -> List[str]:
    raw = os.getenv("ALLOWED_ORIGINS", "")
    if not raw:
        return DEFAULT_ALLOWED_ORIGINS
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


app = FastAPI(title="FixEasy Backend", version="2025.2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UploadRequest(BaseModel):
    filename: str = Field(..., description="Original filename")
    content_type: str = Field(..., description="MIME type")
    content_length: int = Field(..., gt=0, le=25 * 1024 * 1024)
    purpose: str = Field("verification", description="Upload context")

    @validator("filename")
    def validate_filename(cls, value: str) -> str:
        if not value or value.strip() == "":
            raise ValueError("Filename is required")
        return value

    @validator("content_type")
    def validate_mime(cls, value: str) -> str:
        if "/" not in value:
            raise ValueError("Invalid MIME type")
        return value


class UploadResponse(BaseModel):
    upload_url: str
    asset_url: str
    expires_at: datetime


class VerificationDocuments(BaseModel):
    photo_id_url: str
    selfie_url: str
    insurance_url: Optional[str]

    @validator("photo_id_url", "selfie_url")
    def must_be_present(cls, value: str) -> str:
        if not value or value.strip() == "":
            raise ValueError("Document URL is required")
        return value


class ProfessionalRegistration(BaseModel):
    full_name: str = Field(..., min_length=3, max_length=120)
    email: EmailStr
    phone: str = Field(..., regex=r"^\+?353[1-9][0-9]{7,8}$")
    service_categories: List[str] = Field(..., min_items=1)
    service_areas: List[str] = Field(..., min_items=1)
    other_category_detail: Optional[str]
    consent: bool = Field(..., description="User confirmed authenticity")
    verification_documents: VerificationDocuments

    @validator("other_category_detail")
    def check_other_detail(cls, value: Optional[str], values):
        if not values.get("service_categories"):
            return value
        if "Other (please specify)" in values["service_categories"] and not (value and value.strip()):
            raise ValueError("Additional service detail is required")
        return value


class ProfessionalRegistrationResponse(BaseModel):
    ok: bool = True
    reference: str
    received_at: datetime


class ModerationDecision(BaseModel):
    moderator: EmailStr
    notes: Optional[str] = Field(None, max_length=1000)


class ModerationResponse(BaseModel):
    ok: bool = True
    reference: str
    status: str
    decided_at: datetime


@app.get("/", tags=["status"])
async def root():
    return {"ok": True, "service": "FixEasy Backend", "version": app.version}


@app.get("/healthz", tags=["status"])
async def healthcheck():
    return {"status": "healthy", "timestamp": datetime.utcnow()}


@app.post(f"{API_PREFIX}/storage/sign-upload", response_model=UploadResponse, tags=["storage"])
async def sign_upload(request: UploadRequest):
    token = secrets.token_urlsafe(24)
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    storage_bucket = os.getenv("SUPABASE_STORAGE_BUCKET", "verification")
    asset_path = f"{storage_bucket}/{token}/{request.filename}"
    return UploadResponse(
        upload_url=f"https://supabase-upload.fixeasy/{asset_path}?token={token}",
        asset_url=f"https://cdn.fixeasy/{asset_path}",
        expires_at=expires_at,
    )


@app.post(
    f"{API_PREFIX}/register/pro",
    response_model=ProfessionalRegistrationResponse,
    tags=["registration"],
)
async def register_professional(registration: ProfessionalRegistration):
    if not registration.consent:
        raise HTTPException(status_code=400, detail="Consent must be granted")

    reference = f"PRO-{secrets.token_hex(4).upper()}"
    return ProfessionalRegistrationResponse(
        reference=reference,
        received_at=datetime.utcnow(),
    )


@app.post(
    f"{API_PREFIX}/admin/approve-pro/{{reference}}",
    response_model=ModerationResponse,
    tags=["moderation"],
)
async def approve_professional(reference: str, decision: ModerationDecision):
    return ModerationResponse(
        reference=reference,
        status="approved",
        decided_at=datetime.utcnow(),
    )


@app.post(
    f"{API_PREFIX}/admin/reject-pro/{{reference}}",
    response_model=ModerationResponse,
    tags=["moderation"],
)
async def reject_professional(reference: str, decision: ModerationDecision):
    return ModerationResponse(
        reference=reference,
        status="rejected",
        decided_at=datetime.utcnow(),
    )


@app.get(f"{API_PREFIX}/status", tags=["status"])
async def api_status():
    return {"ok": True, "version": app.version}


