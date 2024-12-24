from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional

from models.user import User
from database.session import SessionLocal
from config import settings

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_current_user(self, token: str) -> User:
        """
        Validate token and return current user
        """
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        try:
            payload = jwt.decode(
                token, 
                settings.SECRET_KEY, 
                algorithms=[settings.ALGORITHM]
            )
            user_id: str = payload.get("sub")
            if user_id is None:
                raise credentials_exception
        except JWTError:
            raise credentials_exception

        async with SessionLocal() as session:
            user = await session.get(User, user_id)
            if user is None:
                raise credentials_exception
            return user

    async def create_access_token(
        self, data: dict, expires_delta: Optional[timedelta] = None
    ) -> str:
        """
        Create JWT access token
        """
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
            
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode, 
            settings.SECRET_KEY, 
            algorithm=settings.ALGORITHM
        )
        return encoded_jwt

    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """
        Verify user credentials and return user if valid
        """
        async with SessionLocal() as session:
            # TODO: Implement user lookup by email
            user = None  # await session.query(User).filter(User.email == email).first()
            if not user:
                return None
            if not user.verify_password(password):
                return None
            return user
