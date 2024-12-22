import pytest
import asyncio
from uuid import UUID
from datetime import datetime
from agents.learning_core import AgentLearningCore, LearningEvent, LearningPattern
from agents.agent_learning import LearningEnabledAgent
from agents.base import AgentType, AgentContext

@pytest.fixture
def learning_core():
    return AgentLearningCore()

@pytest.fixture
def event_data():
    return {
        'task_id': 'test_task',
        'agent_id': 'test_agent',
        'parameters': {'key': 'value'}
    }

@pytest.fixture
def successful_outcome():
    return {
        'success': True,
        'duration': 1.5,
        'result': {'status': 'completed'}
    }

@pytest.fixture
def failed_outcome():
    return {
        'success': False,
        'error': 'test error',
        'duration': 0.5
    }

@pytest.mark.asyncio
async def test_record_event(learning_core, event_data, successful_outcome):
    # Record a test event
    event_id = await learning_core.record_event(
        event_type='test_event',
        context_id=None,
        data=event_data,
        outcome=successful_outcome
    )
    
    # Verify event was recorded
    assert isinstance(event_id, UUID)
    assert event_id in learning_core._events
    
    # Verify event data
    event = learning_core._events[event_id]
    assert event.event_type == 'test_event'
    assert event.data == event_data
    assert event.outcome == successful_outcome

@pytest.mark.asyncio
async def test_pattern_detection(learning_core, event_data, successful_outcome):
    # Record multiple similar successful events
    for _ in range(5):
        await learning_core.record_event(
            event_type='test_pattern',
            context_id=None,
            data=event_data,
            outcome=successful_outcome
        )
    
    # Get patterns
    patterns = await learning_core.get_patterns(event_type='test_pattern')
    
    # Verify pattern detection
    assert len(patterns) > 0
    pattern_id, pattern = patterns[0]
    assert pattern.confidence >= 0.8
    assert pattern.pattern_type == 'test_pattern_success_pattern'

@pytest.mark.asyncio
async def test_learning_enabled_agent():
    # Create a test learning-enabled agent
    agent = LearningEnabledAgent(
        agent_type=AgentType.ASSESSMENT,
        name='test_learning_agent'
    )
    
    # Create a test context
    context = AgentContext(
        session_id=UUID('00000000-0000-0000-0000-000000000000'),
        user_id=UUID('11111111-1111-1111-1111-111111111111'),
        therapist_id=UUID('22222222-2222-2222-2222-222222222222'),
        client_id=UUID('33333333-3333-3333-3333-333333333333')
    )
    
    # Start a session
    session_id = await agent.start_session(context)
    
    # Process a test task
    task = {
        'type': 'test_task',
        'data': {'key': 'value'}
    }
    
    try:
        # Override process_task for testing
        async def mock_process_task(self, task, context):
            return {'status': 'success'}
            
        agent.process_task = mock_process_task.__get__(agent)
        
        result = await agent.process_task(task, context)
        assert result == {'status': 'success'}
        
        # Get learning insights
        insights = await agent.get_learning_insights(session_id)
        assert 'session_stats' in insights
        assert insights['session_stats']['success'] == True
        
    finally:
        await agent.end_session(session_id)

@pytest.mark.asyncio
async def test_pattern_application(learning_core, event_data):
    # Create a sequence of successful events with a common pattern
    pattern_data = {**event_data, 'pattern_key': 'pattern_value'}
    
    for _ in range(5):
        await learning_core.record_event(
            event_type='pattern_test',
            context_id=None,
            data=pattern_data,
            outcome={'success': True}
        )
    
    # Get the detected pattern
    patterns = await learning_core.get_patterns(
        event_type='pattern_test',
        min_confidence=0.8
    )
    assert len(patterns) > 0
    
    # Apply the pattern to new data
    new_data = {'new_key': 'new_value'}
    pattern_id, _ = patterns[0]
    enhanced_data = await learning_core.apply_pattern(pattern_id, new_data)
    
    # Verify pattern was applied
    assert enhanced_data['pattern_key'] == 'pattern_value'
    assert enhanced_data['new_key'] == 'new_value'

@pytest.mark.asyncio
async def test_error_handling(learning_core, event_data, failed_outcome):
    # Record error events
    for _ in range(3):
        await learning_core.record_event(
            event_type='error_test',
            context_id=None,
            data=event_data,
            outcome=failed_outcome
        )
    
    # Get patterns (should detect error pattern)
    patterns = await learning_core.get_patterns(event_type='error_test')
    
    # Verify error pattern detection
    assert len(patterns) > 0
    _, pattern = patterns[0]
    assert pattern.pattern_type == 'error_test_success_pattern'
    assert 'error' in pattern.metadata