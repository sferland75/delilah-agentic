from pydantic import BaseModel
from datetime import date
from typing import Optional, List, Dict
from uuid import UUID

class Education(BaseModel):
    degree: str
    institution: str
    graduation_year: str

class Credentials(BaseModel):
    license_number: str
    education: Education
    certifications: List[str]

class TherapistBase(BaseModel):
    first_name: str
    last_name: str
    credentials: Credentials
    specialties: List[str]
    active: bool = True

class TherapistCreate(TherapistBase):
    pass

class TherapistUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    credentials: Optional[Credentials] = None
    specialties: Optional[List[str]] = None
    active: Optional[bool] = None

class TherapistResponse(TherapistBase):
    id: UUID
    created_at: date
    updated_at: Optional[date] = None

    class Config:
        from_attributes = True