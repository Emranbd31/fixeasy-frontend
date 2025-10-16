from __future__ import annotations
from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, List
import uuid

from ..models.user import ClientUser, ProfessionalUser
from ..models.terms import Terms, TermsAcceptance


@dataclass
class MemoryStore:
    users: Dict[str, ClientUser] = field(default_factory=dict)
    professionals: Dict[str, ProfessionalUser] = field(default_factory=dict)
    terms: List[Terms] = field(default_factory=lambda: [
        Terms(id=1, version="v1.0", content="Initial terms", created_at=datetime(2024, 7, 1))
    ])
    acceptances: List[TermsAcceptance] = field(default_factory=list)

    def create_client(self, **kwargs) -> ClientUser:
        user = ClientUser(id=str(uuid.uuid4()), **kwargs)
        self.users[user.id] = user
        return user

    def create_professional(self, **kwargs) -> ProfessionalUser:
        professional = ProfessionalUser(id=str(uuid.uuid4()), documents=[], **kwargs)
        self.professionals[professional.id] = professional
        return professional

    def latest_terms(self) -> Terms:
        return self.terms[-1]

    def record_acceptance(self, **kwargs) -> TermsAcceptance:
        acceptance = TermsAcceptance(**kwargs)
        self.acceptances.append(acceptance)
        return acceptance


store = MemoryStore()
