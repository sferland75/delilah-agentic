from typing import Optional, List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from fastapi import HTTPException
from contextlib import asynccontextmanager

from database.models import Agent
from database.database import get_db

class AgentRepository:
    def __init__(self, session: AsyncSession):
        self._session = session
    
    async def create(self, agent_data: dict) -> Agent:
        """Create a new agent in the database."""
        try:
            agent = Agent(**agent_data)
            self._session.add(agent)
            await self._session.flush()
            return agent
        except Exception as e:
            await self._session.rollback()
            raise HTTPException(status_code=400, detail=f"Failed to create agent: {str(e)}")

    async def get_by_id(self, agent_id: UUID) -> Optional[Agent]:
        """Retrieve an agent by its ID."""
        query = select(Agent).where(Agent.id == agent_id)
        result = await self._session.execute(query)
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[Agent]:
        """Retrieve all agents with pagination."""
        query = select(Agent).offset(skip).limit(limit)
        result = await self._session.execute(query)
        return result.scalars().all()

    async def update(self, agent_id: UUID, agent_data: dict) -> Optional[Agent]:
        """Update an agent's information."""
        try:
            query = update(Agent).where(Agent.id == agent_id).values(**agent_data)
            await self._session.execute(query)
            await self._session.flush()
            return await self.get_by_id(agent_id)
        except Exception as e:
            await self._session.rollback()
            raise HTTPException(status_code=400, detail=f"Failed to update agent: {str(e)}")

    async def delete(self, agent_id: UUID) -> bool:
        """Delete an agent from the database."""
        try:
            query = delete(Agent).where(Agent.id == agent_id)
            result = await self._session.execute(query)
            await self._session.flush()
            return result.rowcount > 0
        except Exception as e:
            await self._session.rollback()
            raise HTTPException(status_code=400, detail=f"Failed to delete agent: {str(e)}")

    async def update_state(self, agent_id: UUID, state: dict) -> Optional[Agent]:
        """Update an agent's state."""
        try:
            query = update(Agent).where(Agent.id == agent_id).values(state=state)
            await self._session.execute(query)
            await self._session.flush()
            return await self.get_by_id(agent_id)
        except Exception as e:
            await self._session.rollback()
            raise HTTPException(status_code=400, detail=f"Failed to update agent state: {str(e)}")

class AgentUnitOfWork:
    """Unit of Work pattern implementation for managing database transactions."""
    
    def __init__(self):
        self._session: Optional[AsyncSession] = None
        self.agents: Optional[AgentRepository] = None

    async def __aenter__(self):
        self._session = await anext(get_db())
        self.agents = AgentRepository(self._session)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            await self._session.rollback()
        else:
            await self._session.commit()
        await self._session.close()

    async def commit(self):
        """Commit the current transaction."""
        await self._session.commit()

    async def rollback(self):
        """Rollback the current transaction."""
        await self._session.rollback()
