from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database.models import Client
from api.crud.base import CRUDBase
from api.schemas.client import ClientCreate, ClientUpdate

class CRUDClient(CRUDBase[Client, ClientCreate, ClientUpdate]):
    async def get_by_email(self, db: AsyncSession, *, email: str) -> Optional[Client]:
        query = select(Client).filter(Client.email == email)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_active(self, db: AsyncSession, *, skip: int = 0, limit: int = 100) -> List[Client]:
        query = select(Client).filter(Client.is_active == True).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

client = CRUDClient(Client)