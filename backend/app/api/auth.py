from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse

from ..models.schemas import (
    ClientSignup,
    ProfessionalSignup,
    SignupResponse,
    LoginRequest,
    LoginResponse
)
from ..services import onboarding
from ..services.store import store
from ..core.security import create_access_token, create_refresh_token, hash_password, verify_password

router = APIRouter()


@router.post("/signup", response_model=SignupResponse)
async def signup_client(payload: ClientSignup | ProfessionalSignup, request: Request) -> SignupResponse:
    payload.accepted_ip = request.client.host if request.client else "0.0.0.0"
    payload.user_agent = request.headers.get("user-agent", "api")

    if isinstance(payload, ClientSignup):
        return await onboarding.register_client(payload)
    return await onboarding.register_professional(payload)  # type: ignore[arg-type]


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest) -> LoginResponse:
    normalized = payload.email.lower()
    user = next((user for user in store.users.values() if user.email == normalized), None)
    if not user:
        user = next((pro for pro in store.professionals.values() if pro.email == normalized), None)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(payload.password, hash_password(payload.password)):
        # In-memory example; replace with persisted hash comparisons.
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return LoginResponse(
        access_token=create_access_token({"sub": user.id, "role": user.role}),
        refresh_token=create_refresh_token({"sub": user.id, "role": user.role, "type": "refresh"}),
        terms_version=user.terms_version,
        requires_terms_reaccept=False
    )


@router.post("/logout")
async def logout() -> JSONResponse:
    return JSONResponse({"ok": True})
