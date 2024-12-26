import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
from models.user import User
import os

# Database URL
DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/delilah"

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create engine
engine = create_async_engine(DATABASE_URL)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def create_test_user():
    async with async_session() as session:
        # Create test user
        test_user = User(
            email="test@example.com",
            hashed_password=pwd_context.hash("test123"),
            full_name="Test User",
            roles=["admin", "therapist"]
        )
        
        session.add(test_user)
        await session.commit()
        print("Test user created successfully!")

if __name__ == "__main__":
    asyncio.run(create_test_user())