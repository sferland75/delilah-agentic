<<<<<<< HEAD
# tests/conftest.py
import pytest
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.pool import NullPool

from app.database import Base
from config.test_config import test_settings

@pytest.fixture(scope="session")
async def async_engine():
    engine = create_async_engine(
        test_settings.DATABASE_URL,
        poolclass=NullPool,
        echo=True
    )
    yield engine
    await engine.dispose()

@pytest.fixture(scope="session")
async def create_tables(async_engine):
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def async_session(async_engine, create_tables) -> AsyncGenerator[AsyncSession, None]:
    async_session_maker = async_sessionmaker(
        async_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    async with async_session_maker() as session:
        yield session
        await session.rollback()
=======
import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
>>>>>>> 6bb53329c68f8c4735e833d296a7da5546e63a5d
