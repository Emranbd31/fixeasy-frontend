from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    id: str
    email: EmailStr
    phone: str
    full_name: str
    marketing_consent: bool
    terms_version: str
    terms_accepted_at: datetime
    accepted_ip: str
    user_agent: str
    oauth_provider: str
    created_at: datetime
    verified: bool


class ClientUser(UserBase):
    role: str = "client"
    eircode: str


class ProfessionalUser(UserBase):
    role: str = "professional"
    company_name: str
    registration_number: str
    pps_number: str
    categories: List[str]
    service_area: str
    availability: Optional[str]
    kyc_status: str
    stripe_account_id: Optional[str]
    documents: List[dict]
