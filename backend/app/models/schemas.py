from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr


class SignupBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    marketing_consent: bool = False
    terms_version: str
    terms_accepted_at: datetime
    accepted_ip: Optional[str] = None
    user_agent: Optional[str] = None
    oauth_provider: Optional[str] = None


class ClientSignup(SignupBase):
    eircode: str


class ProfessionalSignup(SignupBase):
    company_name: str
    registration_number: str
    pps_number: str
    categories: List[str]
    service_area: str
    availability: Optional[str]
    bank_account_token: str


class SignupResponse(BaseModel):
    reference: str
    received_at: datetime
    terms_version: str
    access_token: str
    refresh_token: str
    kyc_status: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    terms_version: str
    requires_terms_reaccept: bool = False


class TermsResponse(BaseModel):
    version: str
    published_at: datetime
    content: str


class TermsAcceptRequest(BaseModel):
    user_id: str
    account_type: str
    version: str


class KycUpdateRequest(BaseModel):
    professional_id: str
    type: str
    url: str
    kyc_status: Optional[str]
