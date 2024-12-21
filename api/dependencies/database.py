from typing import Generator
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database.session import SessionLocal

async def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        await db.close()