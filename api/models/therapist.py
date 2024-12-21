from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, EmailStr

class Specialization(BaseModel):
    name: str
    description: Optional[str] = None

class TherapistBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    license_number: str
    license_state: str
    specializations: List[Specialization] = []
    years_of_experience: Optional[int] = None
    assessment_count: int = 0
    rating: float = 0.0

class TherapistCreate(TherapistBase):
    pass

class TherapistUpdate(TherapistBase):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    license_number: Optional[str] = None
    license_state: Optional[str] = None

class Therapist(TherapistBase):
    id: UUID
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True