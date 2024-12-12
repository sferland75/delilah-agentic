from typing import Optional, List
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from .base import BaseRepository
from database.models import Client
from api.models.client import ClientCreate, ClientUpdate

class ClientRepository(BaseRepository[Client]):
    def __init__(self, session: AsyncSession):
        super().__init__(Client, session)

    async def search_clients(
        self,
        search: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[Client]:
        """Search clients by name or email"""
        query = select(Client).where(
            or_(
                Client.first_name.ilike(f"%{search}%"),
                Client.last_name.ilike(f"%{search}%"),
                Client.email.ilike(f"%{search}%")
            )
        ).offset(skip).limit(limit)
        
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def create_client(self, client_in: ClientCreate) -> Client:
        """Create a new client"""
        db_obj = Client(**client_in.model_dump())
        self.session.add(db_obj)
        await self.session.flush()
        return db_obj

    async def update_client(self, client: Client, client_in: ClientUpdate) -> Client:
        """Update client information"""
        update_data = client_in.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(client, field, value)

        await self.session.flush()
        return client

    async def get_active_clients(
        self,
        skip: int = 0,
        limit: int = 100
    ) -> List[Client]:
        """Get only active clients"""
        query = select(Client).where(
            Client.is_active == True
        ).offset(skip).limit(limit)
        
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def soft_delete(self, client: Client) -> Client:
        """Soft delete a client"""
        client.is_active = False
        await self.session.flush()
        return client