from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from ..models.user import UserCreate, User, UserLogin
from ..core.security import (
    Token,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    check_permissions
)
from coordinator import AgentCoordinator

router = APIRouter()

@router.post("/register", response_model=User)
async def register_user(
    user: UserCreate,
    coordinator: AgentCoordinator = Depends(get_coordinator)
):
    """Register a new user"""
    # Check if email already exists
    existing_user = await coordinator.user_manager.get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    return await coordinator.user_manager.create_user(user)

@router.post("/token", response_model=Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    coordinator: AgentCoordinator = Depends(get_coordinator)
):
    """Login to get access token"""
    user = await coordinator.user_manager.authenticate_user(
        form_data.username,  # email
        form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    """Get current user information"""
    return current_user

@router.post("/logout")
async def logout(
    current_user: Annotated[User, Depends(get_current_user)],
    coordinator: AgentCoordinator = Depends(get_coordinator)
):
    """Logout current user"""
    # You might want to implement token blacklisting here
    return {"message": "Successfully logged out"}