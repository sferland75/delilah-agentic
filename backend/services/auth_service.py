from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import logging
from passlib.context import CryptContext

from models.user import User
from config import settings

logger = logging.getLogger(__name__)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_current_user(self, token: str) -> User:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id: str = payload.get("sub")
            if user_id is None:
                logger.error("No user_id in token")
                raise credentials_exception
        except JWTError as e:
            logger.error(f"JWT decode error: {e}")
            raise credentials_exception

        result = await self.db.execute(select(User).filter(User.id == int(user_id)))
        user = result.scalar_one_or_none()
        
        if user is None:
            logger.error(f"No user found for id {user_id}")
            raise credentials_exception
            
        return user

    async def create_access_token(
        self, data: dict, expires_delta: Optional[timedelta] = None
    ) -> str:
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

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception as e:
            logger.error(f"Password verification error: {e}")
            return False

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        logger.info(f"Attempting authentication for email: {email}")
        
        try:
            result = await self.db.execute(select(User).filter(User.email == email))
            user = result.scalar_one_or_none()
            
            if not user:
                logger.warning(f"No user found for email {email}")
                return None

            if not self.verify_password(password, user.hashed_password):
                logger.warning("Invalid password")
                return None
                
            logger.info(f"Successfully authenticated user: {email}")
            return user
        except Exception as e:
            logger.error(f"Authentication error: {e}")
            return None