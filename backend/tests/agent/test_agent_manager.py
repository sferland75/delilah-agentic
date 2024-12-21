import pytest
import asyncio
from agent.agent_manager import AgentManager
from agent.state_machine import AgentState

@pytest.fixture
async def manager():
    """Create agent manager instance"""
    manager = AgentManager()
    yield manager
    await manager.shutdown()

@pytest.mark.asyncio
async def test_agent_creation(manager):
    """Test creating new agents"""
    agent = await manager.create_agent(
        "assessment",
        "test-agent",
        {"test": True}
    )
    
    assert agent.agent_id == "test-agent"
    assert agent.state_machine.state == AgentState.IDLE
    
    # Verify manager state
    assert "test-agent" in manager.agents
    assert "test-agent" in manager.agent_configs

@pytest.mark.asyncio
async def test_duplicate_agent_creation(manager):
    """Test handling of duplicate agent creation"""
    await manager.create_agent("assessment", "test-agent", {})
    
    with pytest.raises(ValueError):
        await manager.create_agent("assessment", "test-agent", {})

@pytest.mark.asyncio
async def test_agent_task_assignment(manager):
    """Test assigning tasks to agents"""
    agent = await manager.create_agent("assessment", "test-agent", {})
    
    task = {
        "assessment_type": "initial",
        "client_data": {}
    }
    
    await manager.assign_task("test-agent", task)
    
    # Agent should return to IDLE after task
    agent_status = await manager.get_agent_status("test-agent")
    assert agent_status["state"] == "idle"

@pytest.mark.asyncio
async def test_concurrent_task_assignment(manager):
    """Test handling concurrent task assignments"""
    await manager.create_agent("assessment", "test-agent", {})
    
    task1 = {"assessment_type": "initial", "client_data": {}}
    task2 = {"assessment_type": "follow_up", "client_data": {}}
    
    # Try to assign tasks concurrently
    with pytest.raises(ValueError):
        await asyncio.gather(
            manager.assign_task("test-agent", task1),
            manager.assign_task("test-agent", task2)
        )

@pytest.mark.asyncio
async def test_agent_termination(manager):
    """Test agent termination"""
    await manager.create_agent("assessment", "test-agent", {})
    await manager.terminate_agent("test-agent")
    
    # Agent should be removed from manager
    assert "test-agent" not in manager.agents
    assert "test-agent" not in manager.agent_configs
    
    # Should not be able to get terminated agent
    with pytest.raises(ValueError):
        await manager.get_agent_status("test-agent")

@pytest.mark.asyncio
async def test_manager_shutdown(manager):
    """Test manager shutdown"""
    await manager.create_agent("assessment", "agent1", {})
    await manager.create_agent("assessment", "agent2", {})
    
    await manager.shutdown()
    
    assert len(manager.agents) == 0
    assert len(manager.agent_configs) == 0

@pytest.mark.asyncio
async def test_get_agent_status(manager):
    """Test getting agent status"""
    await manager.create_agent("assessment", "test-agent", {})
    
    status = await manager.get_agent_status("test-agent")
    assert status["agent_id"] == "test-agent"
    assert status["state"] == "idle"
    assert status["current_task"] is None