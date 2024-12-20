# tests/database/test_connection.py
import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import async_session, Base, engine
from database.models import User
from database.user_role import UserRole
from uuid import uuid4

@pytest.fixture
async def test_db():
    # Set up database
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Create test session
    async with async_session() as session:
        yield session
        
    # Clean up
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.mark.asyncio
async def test_create_user(test_db: AsyncSession):
    # Create test user
    test_user = User(
        id=uuid4(),
        email="test@example.com",
        hashed_password="testpass",
        first_name="Test",
        last_name="User",
        role=UserRole.THERAPIST,
        is_active=True
    )
    test_db.add(test_user)
    await test_db.commit()
    
    # Verify user was created
    result = await test_db.get(User, test_user.id)
    assert result.email == "test@example.com"
    assert result.first_name == "Test"
    assert result.role == UserRole.THERAPIST