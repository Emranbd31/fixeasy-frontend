from datetime import datetime
from pydantic import BaseModel


class Terms(BaseModel):
    id: int
    version: str
    content: str
    created_at: datetime
    archived: bool = False


class TermsAcceptance(BaseModel):
    user_id: str
    account_type: str
    version: str
    accepted_at: datetime
    accepted_ip: str
    user_agent: str
