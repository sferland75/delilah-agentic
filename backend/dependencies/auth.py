from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.user import User
from typing import Optional
from jose import JWTError, jwt
from services.auth_service import SECRET_KEY, ALGORITHM
import logging

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError as e:
        logging.error(f"JWT decode error: {e}")
        raise credentials_exception

    try:
        result = await db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if user is None:
            logging.error(f"User not found for token: {user_id}")
            raise credentials_exception
        return user
    except Exception as e:
        logging.error(f"Database error in get_current_user: {e}")
        raise credentials_exception

def check_roles(required_roles: list[str]):
    async def role_checker(user: User = Depends(get_current_user)):
        if not any(role in user.roles for role in required_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You don't have the required permissions"
            )
        return user
    return role_checker