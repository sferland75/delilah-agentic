from fastapi import Depends
from .coordinator import AgentCoordinator
from api.repositories.agent_repository import EnhancedAgentRepository
from database.database import get_db

async def get_repository():
    async for session in get_db():
        yield EnhancedAgentRepository(session)

async def get_coordinator(
    repo: EnhancedAgentRepository = Depends(get_repository)
) -> AgentCoordinator:
    return AgentCoordinator(repo)
