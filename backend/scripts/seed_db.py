from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
from models.user import User
import asyncio
import logging

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Database URL
DATABASE_URL = "postgresql+asyncpg://postgres:postgres@db:5432/delilah"

# Create async engine
engine = create_async_engine(DATABASE_URL)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def seed_database():
    async with async_session() as session:
        try:
            # Check if test user exists
            result = await session.execute(
                "SELECT * FROM users WHERE email = 'test@example.com'"
            )
            if result.first() is None:
                # Create test user
                test_user = User(
                    email="test@example.com",
                    hashed_password=pwd_context.hash("test123"),
                    full_name="Test User",
                    roles=["admin", "therapist"],
                    is_active=True
                )
                
                session.add(test_user)
                await session.commit()
                logging.info("Test user created successfully!")
            else:
                logging.info("Test user already exists")
        except Exception as e:
            logging.error(f"Error seeding database: {e}")
            await session.rollback()
            raise

if __name__ == "__main__":
    asyncio.run(seed_database())