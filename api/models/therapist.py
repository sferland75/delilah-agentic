from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Optional

class TherapistBase(BaseModel):
    name: str
    email: str
    license_number: str
    specialization: Optional[str] = None

class TherapistCreate(TherapistBase):
    pass

class TherapistUpdate(TherapistBase):
    name: Optional[str] = None
    email: Optional[str] = None
    license_number: Optional[str] = None

class Therapist(TherapistBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime
    is_active: bool = True

    class Config:
        from_attributes = True