from datetime import datetime
from typing import List

from ..core.security import create_access_token, create_refresh_token, hash_password
from ..models.schemas import ClientSignup, ProfessionalSignup, SignupResponse
from ..services.store import store


async def register_client(payload: ClientSignup) -> SignupResponse:
    terms = store.latest_terms()
    user = store.create_client(
        email=payload.email,
        phone=payload.phone,
        full_name=payload.full_name,
        marketing_consent=payload.marketing_consent,
        terms_version=terms.version,
        terms_accepted_at=payload.terms_accepted_at,
        accepted_ip=payload.accepted_ip or "0.0.0.0",
        user_agent=payload.user_agent or "api",
        oauth_provider=payload.oauth_provider or "password",
        created_at=datetime.utcnow(),
        verified=False,
        eircode=payload.eircode,
    )
    store.record_acceptance(
        user_id=user.id,
        account_type="client",
        version=terms.version,
        accepted_at=payload.terms_accepted_at,
        accepted_ip=payload.accepted_ip or "0.0.0.0",
        user_agent=payload.user_agent or "api",
    )
    access = create_access_token({"sub": user.id, "role": "client"})
    refresh = create_refresh_token({"sub": user.id, "role": "client", "type": "refresh"})
    return SignupResponse(
        reference=f"CL-{user.id[:8].upper()}",
        received_at=datetime.utcnow(),
        terms_version=terms.version,
        access_token=access,
        refresh_token=refresh,
    )


async def register_professional(payload: ProfessionalSignup) -> SignupResponse:
    terms = store.latest_terms()
    professional = store.create_professional(
        email=payload.email,
        phone=payload.phone,
        full_name=payload.full_name,
        marketing_consent=payload.marketing_consent,
        terms_version=terms.version,
        terms_accepted_at=payload.terms_accepted_at,
        accepted_ip=payload.accepted_ip or "0.0.0.0",
        user_agent=payload.user_agent or "api",
        oauth_provider=payload.oauth_provider or "password",
        created_at=datetime.utcnow(),
        verified=False,
        company_name=payload.company_name,
        registration_number=payload.registration_number,
        pps_number=payload.pps_number,
        categories=payload.categories,
        service_area=payload.service_area,
        availability=payload.availability,
        kyc_status="pending",
        stripe_account_id=None,
    )
    store.record_acceptance(
        user_id=professional.id,
        account_type="professional",
        version=terms.version,
        accepted_at=payload.terms_accepted_at,
        accepted_ip=payload.accepted_ip or "0.0.0.0",
        user_agent=payload.user_agent or "api",
    )
    access = create_access_token({"sub": professional.id, "role": "professional"})
    refresh = create_refresh_token({"sub": professional.id, "role": "professional", "type": "refresh"})
    return SignupResponse(
        reference=f"PR-{professional.id[:8].upper()}",
        received_at=datetime.utcnow(),
        terms_version=terms.version,
        access_token=access,
        refresh_token=refresh,
        kyc_status=professional.kyc_status,
    )
