from sqlalchemy.orm import Session
from typing import Optional, List
from ..models.user import User
from ..auth import get_password_hash, verify_password
from fastapi import HTTPException, status

class UserService:
    def __init__(self, db: Session):
        self.db = db

    def get_user_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def create_user(self, email: str, password: str, full_name: str, roles: List[str]) -> User:
        if self.get_user_by_email(email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        user = User(
            email=email,
            hashed_password=get_password_hash(password),
            full_name=full_name,
            roles=roles
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        user = self.get_user_by_email(email)
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

    def get_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        return self.db.query(User).offset(skip).limit(limit).all()

    def update_user(self, user_id: str, update_data: dict) -> Optional[User]:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return None
            
        for key, value in update_data.items():
            if key == 'password':
                user.hashed_password = get_password_hash(value)
            else:
                setattr(user, key, value)
        
        self.db.commit()
        self.db.refresh(user)
        return user