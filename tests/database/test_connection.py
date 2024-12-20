import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from database.database import async_session, Base, engine
from database.models import User
from uuid import uuid4

@pytest.fixture
async def test_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with async_session() as session:
        yield session
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.mark.asyncio
async def test_create_user(test_db: AsyncSession):
    test_user = User(
        id=uuid4(),
        email="test@example.com",
        hashed_password="testpass",
        first_name="Test",
        last_name="User",
        role="THERAPIST",
        is_active=True
    )
    test_db.add(test_user)
    await test_db.commit()
    result = await test_db.get(User, test_user.id)
    assert result.email == "test@example.com"
