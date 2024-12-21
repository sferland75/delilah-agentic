from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime
from uuid import UUID

class ClientBase(BaseModel):
    first_name: str
    last_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    emergency_contact: Optional[str] = None
    primary_diagnosis: Optional[str] = None
    notes: Optional[str] = None

class ClientCreate(ClientBase):
    date_of_birth: Optional[datetime] = None

class ClientUpdate(ClientBase):
    is_active: Optional[bool] = None

class ClientInDBBase(ClientBase):
    id: UUID
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Client(ClientInDBBase):
    pass

class ClientInDB(ClientInDBBase):
    pass