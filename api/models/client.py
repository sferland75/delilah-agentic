from typing import Optional
from datetime import date
from uuid import UUID
from pydantic import BaseModel, EmailStr
from .base import TimestampedModel

class ClientBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    emergency_contact: Optional[str] = None
    emergency_phone: Optional[str] = None
    medical_history: Optional[str] = None
    insurance_info: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None

class Client(ClientBase, TimestampedModel):
    id: UUID
    is_active: bool = True