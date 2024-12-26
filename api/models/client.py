from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Optional

class ClientBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    name: Optional[str] = None
    email: Optional[str] = None

class Client(ClientBase):
    id: UUID4
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True