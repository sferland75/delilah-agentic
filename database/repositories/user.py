from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .base import BaseRepository
from database.models import User
from api.models.user import UserCreate, UserUpdate
from api.core.security import get_password_hash

class UserRepository(BaseRepository[User]):
    def __init__(self, session: AsyncSession):
        super().__init__(User, session)

    async def get_by_email(self, email: str) -> Optional[User]:
        """Get a user by email"""
        query = select(User).where(User.email == email)
        result = await self.session.execute(query)
        return result.scalars().first()

    async def create_user(self, user_in: UserCreate) -> User:
        """Create a new user with hashed password"""
        db_obj = User(
            email=user_in.email,
            hashed_password=get_password_hash(user_in.password),
            first_name=user_in.first_name,
            last_name=user_in.last_name,
            role=user_in.role
        )
        self.session.add(db_obj)
        await self.session.flush()
        return db_obj

    async def update_user(self, user: User, user_in: UserUpdate) -> User:
        """Update user information"""
        update_data = user_in.model_dump(exclude_unset=True)
        
        if update_data.get("password"):
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password

        for field, value in update_data.items():
            setattr(user, field, value)

        await self.session.flush()
        return user

    async def authenticate(self, email: str, password: str) -> Optional[User]:
        """Authenticate a user by email and password"""
        user = await self.get_by_email(email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user