import pytest
from database.service import DatabaseService
from agent.assessment_agent import AssessmentAgent
from agent.agent_manager import AgentManager
from agent.state_machine import AgentState
from database.models import AgentStatus, TaskStatus

@pytest.mark.asyncio
async def test_agent_state_persistence(db, sample_config):
    """Test that agent state changes are correctly persisted to database"""
    # Create agent through database
    agent_record = await db.create_agent(
        agent_id="test-assessment-agent",
        agent_type="assessment",
        config=sample_config
    )
    
    # Create assessment agent
    agent = AssessmentAgent("test-assessment-agent", sample_config)
    await agent.initialize()
    
    # Process a task
    task = {
        "assessment_type": "initial",
        "client_data": {
            "age": 25,
            "medical_history": [],
            "support_system": {"family_support": True}
        }
    }
    
    # Record initial state
    await db.record_agent_state_transition(
        agent_id="test-assessment-agent",
        from_state=AgentState.IDLE.value,
        to_state=AgentState.ANALYZING.value
    )
    
    # Process task
    await agent.process_task(task)
    
    # Verify state transitions in database
    transitions = await db.get_agent_state_history("test-assessment-agent")
    assert len(transitions) >= 1
    
    # Verify final state
    agent_record = await db.get_agent("test-assessment-agent")
    assert agent_record is not None

@pytest.mark.asyncio
async def test_agent_task_lifecycle(db, sample_config):
    """Test complete agent task lifecycle with database integration"""
    # Initialize agent manager
    manager = AgentManager()
    
    # Create agent
    agent = await manager.create_agent(
        "assessment",
        "lifecycle-test-agent",
        sample_config
    )
    
    # Create task in database
    task = await db.create_task(
        agent_id="lifecycle-test-agent",
        task_type="assessment",
        input_data={
            "assessment_type": "initial",
            "client_data": {
                "age": 30,
                "risk_factors": ["anxiety"]
            }
        }
    )
    
    # Start task processing
    await db.update_task_status(task.id, TaskStatus.IN_PROGRESS)
    
    # Simulate task completion
    output_data = {
        "analysis": {
            "risk_level": "moderate",
            "recommendations": ["counseling"]
        }
    }
    
    await db.update_task_status(
        task.id,
        TaskStatus.COMPLETED,
        output_data=output_data
    )
    
    # Verify task record
    task_record = await db.get_task(task.id)
    assert task_record.status == TaskStatus.COMPLETED
    assert task_record.output_data == output_data
    
    # Verify state transitions
    task_transitions = await db.get_task_state_history(task.id)
    assert len(task_transitions) >= 2  # Should have at least start and complete transitions

@pytest.mark.asyncio
async def test_concurrent_agent_tasks(db, sample_config):
    """Test handling of concurrent tasks with database integration"""
    manager = AgentManager()
    
    # Create agent
    agent = await manager.create_agent(
        "assessment",
        "concurrent-test-agent",
        sample_config
    )
    
    # Create multiple tasks
    tasks = []
    for i in range(3):
        task = await db.create_task(
            agent_id="concurrent-test-agent",
            task_type="assessment",
            input_data={
                "assessment_type": "initial",
                "client_data": {"id": f"client-{i}"}
            },
            priority=i
        )
        tasks.append(task)
    
    # Try to process tasks concurrently
    with pytest.raises(ValueError):
        await asyncio.gather(
            *[manager.assign_task(
                "concurrent-test-agent",
                task.input_data
            ) for task in tasks]
        )
    
    # Verify only one task can be in progress
    in_progress_tasks = await db.get_tasks_by_status(TaskStatus.IN_PROGRESS)
    assert len(in_progress_tasks) <= 1

@pytest.mark.asyncio
async def test_agent_error_handling(db, sample_config):
    """Test error handling with database integration"""
    manager = AgentManager()
    
    # Create agent
    agent = await manager.create_agent(
        "assessment",
        "error-test-agent",
        sample_config
    )
    
    # Create task with invalid data to trigger error
    task = await db.create_task(
        agent_id="error-test-agent",
        task_type="assessment",
        input_data={"invalid": "data"}
    )
    
    # Process task (should fail)
    with pytest.raises(Exception):
        await manager.assign_task(
            "error-test-agent",
            task.input_data
        )
    
    # Verify task is marked as failed
    task_record = await db.get_task(task.id)
    assert task_record.status == TaskStatus.FAILED
    assert task_record.error_message is not None
    
    # Verify agent state
    agent_record = await db.get_agent("error-test-agent")
    assert agent_record.status == AgentStatus.ERROR
    
    # Verify error state transition
    transitions = await db.get_agent_state_history("error-test-agent")
    error_transitions = [t for t in transitions if t.to_state == "error"]
    assert len(error_transitions) > 0