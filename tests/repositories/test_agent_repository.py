import pytest
from uuid import UUID, uuid4
from api.repositories.agent_repository import AgentRepository, AgentUnitOfWork

@pytest.mark.asyncio
async def test_create_agent():
    async with AgentUnitOfWork() as uow:
        agent_data = {
            "name": "Test Agent",
            "type": "assessor",
            "state": {"status": "ready"}
        }
        agent = await uow.agents.create(agent_data)
        assert agent.name == "Test Agent"
        assert agent.type == "assessor"
        assert agent.state == {"status": "ready"}

@pytest.mark.asyncio
async def test_get_agent():
    async with AgentUnitOfWork() as uow:
        # First create an agent
        agent_data = {
            "name": "Test Agent",
            "type": "assessor",
            "state": {"status": "ready"}
        }
        created_agent = await uow.agents.create(agent_data)
        
        # Then retrieve it
        agent = await uow.agents.get_by_id(created_agent.id)
        assert agent is not None
        assert agent.id == created_agent.id
