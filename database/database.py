from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool
from urllib.parse import quote_plus
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# SQLAlchemy model base class
class Base(DeclarativeBase):
    pass

# Construct database URL from environment variables with proper password encoding
password = quote_plus(os.getenv('POSTGRES_PASSWORD', '4Leafclover!'))
SQLALCHEMY_DATABASE_URL = f"postgresql+asyncpg://{os.getenv('POSTGRES_USER')}:{password}@{os.getenv('POSTGRES_SERVER')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"

# Create async engine
engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    poolclass=NullPool,
    echo=True  # Set to False in production
)

# Create async session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Dependency to get database session
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()