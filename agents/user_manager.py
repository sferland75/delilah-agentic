from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime

from api.models.user import User, UserCreate, UserUpdate
from api.core.security import get_password_hash, verify_password

class UserManager:
    def __init__(self):
        self.users = {}
        self.user_emails = {}
    
    async def create_user(self, user_data: UserCreate) -> User:
        """Create a new user"""
        if user_data.email in self.user_emails:
            raise ValueError("Email already registered")
        
        user_id = uuid4()
        hashed_password = get_password_hash(user_data.password)
        
        user = User(
            id=user_id,
            email=user_data.email,
            role=user_data.role,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            is_active=True
        )
        
        self.users[user_id] = {
            **user.model_dump(),
            "hashed_password": hashed_password
        }
        self.user_emails[user_data.email] = user_id
        
        return user
    
    async def get_user(self, user_id: UUID) -> Optional[User]:
        """Get user by ID"""
        user_data = self.users.get(user_id)
        if not user_data:
            return None
        return User(**{k: v for k, v in user_data.items() if k != "hashed_password"})
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        user_id = self.user_emails.get(email)
        if not user_id:
            return None
        return await self.get_user(user_id)
    
    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        user_id = self.user_emails.get(email)
        if not user_id:
            return None
            
        user_data = self.users[user_id]
        if not verify_password(password, user_data["hashed_password"]):
            return None
            
        return User(**{k: v for k, v in user_data.items() if k != "hashed_password"})
    
    async def update_user(self, user_id: UUID, user_update: UserUpdate) -> Optional[User]:
        """Update user information"""
        if user_id not in self.users:
            return None
            
        user_data = self.users[user_id]
        update_data = user_update.model_dump(exclude_unset=True)
        
        if "password" in update_data:
            update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
            
        if "email" in update_data and update_data["email"] != user_data["email"]:
            if update_data["email"] in self.user_emails:
                raise ValueError("Email already registered")
            self.user_emails.pop(user_data["email"])
            self.user_emails[update_data["email"]] = user_id
        
        user_data.update(update_data)
        self.users[user_id] = user_data
        
        return await self.get_user(user_id)