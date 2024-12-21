from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from uuid import UUID

class TherapistBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    license_number: str
    license_state: str
    years_of_experience: Optional[int] = Field(None, ge=0)
    rating: Optional[float] = Field(None, ge=0.0, le=5.0)

class TherapistCreate(TherapistBase):
    pass

class TherapistUpdate(TherapistBase):
    email: Optional[EmailStr] = None
    license_number: Optional[str] = None
    license_state: Optional[str] = None
    is_active: Optional[bool] = None

class TherapistInDBBase(TherapistBase):
    id: UUID
    assessment_count: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Therapist(TherapistInDBBase):
    pass

class TherapistInDB(TherapistInDBBase):
    pass