from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    THERAPIST = "therapist"
    STAFF = "staff"

class UserBase(BaseModel):
    email: EmailStr
    role: UserRole
    is_active: bool = True

class UserCreate(UserBase):
    password: str
    first_name: str
    last_name: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None

class User(UserBase):
    id: UUID
    first_name: str
    last_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str