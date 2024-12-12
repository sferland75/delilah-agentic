from typing import Optional, List
from datetime import date
from uuid import UUID
from pydantic import BaseModel, EmailStr
from .base import TimestampedModel

class Specialization(BaseModel):
    name: str
    certification_date: Optional[date] = None
    certification_number: Optional[str] = None

class TherapistBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    license_number: str
    license_state: str
    license_expiry: date
    specializations: List[Specialization] = []
    years_of_experience: Optional[int] = None
    bio: Optional[str] = None

class TherapistCreate(TherapistBase):
    pass

class TherapistUpdate(TherapistBase):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    license_number: Optional[str] = None
    license_state: Optional[str] = None
    license_expiry: Optional[date] = None

class Therapist(TherapistBase, TimestampedModel):
    id: UUID
    is_active: bool = True
    assessment_count: int = 0
    rating: Optional[float] = None