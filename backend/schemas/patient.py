from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date
from enum import Enum

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"

class PatientBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    gender: Gender
    contact_number: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    medical_history: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class PatientUpdate(PatientBase):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[Gender] = None

class Patient(PatientBase):
    id: int
    external_id: Optional[str]
    therapist_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True