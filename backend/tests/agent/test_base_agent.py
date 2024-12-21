import pytest
import asyncio
from agent.base_agent import BaseAgent
from agent.state_machine import AgentState

class TestAgent(BaseAgent):
    """Test implementation of BaseAgent"""
    async def _analyze_task(self, task):
        return {"analysis": "complete"}
        
    async def _create_plan(self, analysis):
        return [{"step": "test"}]
        
    async def _execute_plan(self, plan):
        return {"result": "success"}
        
    async def _report_results(self, results):
        pass

@pytest.fixture
def agent():
    """Create test agent instance"""
    return TestAgent("test-agent", {"test": True})

@pytest.mark.asyncio
async def test_initialization(agent):
    """Test agent initialization"""
    await agent.initialize()
    assert agent.state_machine.state == AgentState.IDLE
    
@pytest.mark.asyncio
async def test_process_task(agent):
    """Test task processing workflow"""
    await agent.initialize()
    
    task = {"type": "test_task"}
    await agent.process_task(task)
    
    # Should return to IDLE after completion
    assert agent.state_machine.state == AgentState.IDLE
    assert agent.current_task is None
    
@pytest.mark.asyncio
async def test_task_error_handling(agent):
    """Test error handling during task processing"""
    await agent.initialize()
    
    # Create a failing task
    class FailingAgent(TestAgent):
        async def _analyze_task(self, task):
            raise ValueError("Test error")
    
    failing_agent = FailingAgent("failing-agent", {})
    await failing_agent.initialize()
    
    with pytest.raises(ValueError):
        await failing_agent.process_task({"type": "fail"})
    
    assert failing_agent.state_machine.state == AgentState.ERROR
    
@pytest.mark.asyncio
async def test_concurrent_tasks(agent):
    """Test handling of concurrent task requests"""
    await agent.initialize()
    
    task1 = {"type": "test1"}
    task2 = {"type": "test2"}
    
    # Try to process tasks concurrently
    with pytest.raises(ValueError):
        await asyncio.gather(
            agent.process_task(task1),
            agent.process_task(task2)
        )
        
@pytest.mark.asyncio
async def test_termination(agent):
    """Test agent termination"""
    await agent.initialize()
    await agent.terminate()
    
    assert agent.state_machine.state == AgentState.TERMINATED
    
    # Should not be able to process tasks after termination
    with pytest.raises(ValueError):
        await agent.process_task({"type": "test"})