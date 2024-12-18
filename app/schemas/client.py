from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional, List, Dict
from uuid import UUID

class ContactInfo(BaseModel):
    email: EmailStr
    phone: str
    address: Dict[str, str]

class MedicalHistory(BaseModel):
    conditions: Optional[List[str]] = []
    medications: Optional[List[str]] = []
    allergies: Optional[List[str]] = []
    surgeries: Optional[List[Dict[str, str]]] = []

class ClientBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    contact_info: ContactInfo
    medical_history: Optional[MedicalHistory] = None
    active: bool = True

class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    contact_info: Optional[ContactInfo] = None
    medical_history: Optional[MedicalHistory] = None
    active: Optional[bool] = None

class ClientResponse(ClientBase):
    id: UUID
    created_at: date
    updated_at: Optional[date] = None

    class Config:
        from_attributes = True
