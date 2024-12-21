import pytest
from datetime import datetime
from database.service import DatabaseService
from database.models import AgentStatus, TaskStatus, Agent, AgentTask

TEST_DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/delilah_test"

@pytest.fixture(scope="module")
async def db_service():
    """Create database service for testing"""
    service = DatabaseService(TEST_DATABASE_URL)
    await service.initialize()
    return service

@pytest.mark.asyncio
async def test_create_agent(db_service):
    """Test agent creation"""
    agent = await db_service.create_agent(
        agent_id="test-agent-1",
        agent_type="assessment",
        config={"test": True}
    )
    
    assert agent.agent_id == "test-agent-1"
    assert agent.agent_type == "assessment"
    assert agent.status == AgentStatus.INACTIVE
    assert isinstance(agent.created_at, datetime)
    assert isinstance(agent.updated_at, datetime)

@pytest.mark.asyncio
async def test_get_agent(db_service):
    """Test retrieving agent"""
    # Create agent first
    created_agent = await db_service.create_agent(
        agent_id="test-agent-2",
        agent_type="assessment",
        config={"test": True}
    )
    
    # Retrieve agent
    agent = await db_service.get_agent("test-agent-2")
    assert agent is not None
    assert agent.agent_id == created_agent.agent_id
    assert agent.agent_type == created_agent.agent_type

@pytest.mark.asyncio
async def test_update_agent_status(db_service):
    """Test updating agent status"""
    # Create agent
    agent = await db_service.create_agent(
        agent_id="test-agent-3",
        agent_type="assessment",
        config={"test": True}
    )
    
    # Update status
    updated_agent = await db_service.update_agent_status(
        agent.agent_id,
        AgentStatus.ACTIVE
    )
    
    assert updated_agent.status == AgentStatus.ACTIVE
    assert updated_agent.updated_at > agent.updated_at

@pytest.mark.asyncio
async def test_create_task(db_service):
    """Test task creation"""
    # Create agent first
    agent = await db_service.create_agent(
        agent_id="test-agent-4",
        agent_type="assessment",
        config={"test": True}
    )
    
    # Create task
    task = await db_service.create_task(
        agent_id=agent.agent_id,
        task_type="assessment",
        input_data={"test": True},
        priority=1
    )
    
    assert task.task_type == "assessment"
    assert task.status == TaskStatus.PENDING
    assert task.priority == 1
    assert task.input_data == {"test": True}
    assert task.started_at is None
    assert task.completed_at is None

@pytest.mark.asyncio
async def test_update_task_status(db_service):
    """Test updating task status"""
    # Create agent and task
    agent = await db_service.create_agent(
        agent_id="test-agent-5",
        agent_type="assessment",
        config={"test": True}
    )
    
    task = await db_service.create_task(
        agent_id=agent.agent_id,
        task_type="assessment",
        input_data={"test": True}
    )
    
    # Update task to in-progress
    in_progress_task = await db_service.update_task_status(
        task.id,
        TaskStatus.IN_PROGRESS
    )
    assert in_progress_task.status == TaskStatus.IN_PROGRESS
    assert in_progress_task.started_at is not None
    
    # Complete task
    completed_task = await db_service.update_task_status(
        task.id,
        TaskStatus.COMPLETED,
        output_data={"result": "success"}
    )
    assert completed_task.status == TaskStatus.COMPLETED
    assert completed_task.completed_at is not None
    assert completed_task.output_data == {"result": "success"}

@pytest.mark.asyncio
async def test_record_agent_state_transition(db_service):
    """Test recording agent state transitions"""
    # Create agent
    agent = await db_service.create_agent(
        agent_id="test-agent-6",
        agent_type="assessment",
        config={"test": True}
    )
    
    # Record transition
    transition = await db_service.record_agent_state_transition(
        agent_id=agent.agent_id,
        from_state="idle",
        to_state="analyzing",
        context={"trigger": "new_task"}
    )
    
    assert transition.from_state == "idle"
    assert transition.to_state == "analyzing"
    assert transition.context == {"trigger": "new_task"}

@pytest.mark.asyncio
async def test_get_agent_state_history(db_service):
    """Test retrieving agent state history"""
    # Create agent
    agent = await db_service.create_agent(
        agent_id="test-agent-7",
        agent_type="assessment",
        config={"test": True}
    )
    
    # Record multiple transitions
    transitions = [
        ("idle", "initializing"),
        ("initializing", "analyzing"),
        ("analyzing", "executing"),
        ("executing", "idle")
    ]
    
    for from_state, to_state in transitions:
        await db_service.record_agent_state_transition(
            agent_id=agent.agent_id,
            from_state=from_state,
            to_state=to_state
        )
    
    # Get history
    history = await db_service.get_agent_state_history(agent.agent_id)
    assert len(history) == len(transitions)
    assert [t.from_state for t in history] == [t[0] for t in transitions]
    assert [t.to_state for t in history] == [t[1] for t in transitions]

@pytest.mark.asyncio
async def test_task_state_transitions(db_service):
    """Test recording and retrieving task state transitions"""
    # Create agent and task
    agent = await db_service.create_agent(
        agent_id="test-agent-8",
        agent_type="assessment",
        config={"test": True}
    )
    
    task = await db_service.create_task(
        agent_id=agent.agent_id,
        task_type="assessment",
        input_data={"test": True}
    )
    
    # Record transitions
    await db_service.record_task_state_transition(
        task_id=task.id,
        from_state="pending",
        to_state="processing"
    )
    
    await db_service.record_task_state_transition(
        task_id=task.id,
        from_state="processing",
        to_state="completed",
        context={"result": "success"}
    )
    
    # Get history
    history = await db_service.get_task_state_history(task.id)
    assert len(history) == 2
    assert history[0].from_state == "pending"
    assert history[1].to_state == "completed"
    assert history[1].context == {"result": "success"}