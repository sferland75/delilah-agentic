from datetime import timedelta
import logging
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from ..core.auth import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    Token,
    User,
    create_access_token,
    get_current_active_user,
    verify_password,
    get_password_hash
)

router = APIRouter()
logger = logging.getLogger(__name__)

# Create a new hash for 'testpass'
test_password_hash = get_password_hash("testpass")
logger.info(f"Generated new password hash for testing: {test_password_hash}")

# Mock user database - in production, use a real database
fake_users_db = {
    "testuser": {
        "username": "testuser",
        "full_name": "Test User",
        "email": "test@example.com",
        "hashed_password": test_password_hash,  # Using newly generated hash
        "disabled": False,
    }
}

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    logger.info(f"Login attempt for user: {form_data.username}")
    logger.info(f"Available users: {list(fake_users_db.keys())}")
    
    user = fake_users_db.get(form_data.username)
    if not user:
        logger.warning(f"User not found: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    logger.info("Verifying password...")
    password_valid = verify_password(form_data.password, user["hashed_password"])
    logger.info(f"Password verification result: {password_valid}")
    
    if not password_valid:
        logger.warning(f"Invalid password for user: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    logger.info(f"Successful login for user: {form_data.username}")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user