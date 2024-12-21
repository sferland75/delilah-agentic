import pytest
from datetime import datetime
from agent.state_machine import AgentState, StateContext, AgentStateMachine

def test_initial_state():
    """Test initial state of state machine"""
    sm = AgentStateMachine()
    assert sm.state == AgentState.IDLE
    assert isinstance(sm.context, StateContext)
    assert sm.context.memory == {}
    assert sm.context.execution_history == []

def test_valid_transition():
    """Test valid state transition"""
    sm = AgentStateMachine()
    assert sm.can_transition_to(AgentState.INITIALIZING)
    
    sm.transition_to(AgentState.INITIALIZING)
    assert sm.state == AgentState.INITIALIZING
    assert sm.context.last_state == AgentState.IDLE
    
def test_invalid_transition():
    """Test invalid state transition"""
    sm = AgentStateMachine()
    assert not sm.can_transition_to(AgentState.REPORTING)
    
    with pytest.raises(ValueError):
        sm.transition_to(AgentState.REPORTING)

def test_transition_with_context():
    """Test state transition with context updates"""
    sm = AgentStateMachine()
    task = {"id": "123", "type": "assessment"}
    
    sm.transition_to(AgentState.INITIALIZING, current_task=task)
    assert sm.context.current_task == task
    
def test_execution_history():
    """Test execution history recording"""
    sm = AgentStateMachine()
    
    # Perform multiple transitions
    sm.transition_to(AgentState.INITIALIZING)
    sm.transition_to(AgentState.ANALYZING)
    sm.transition_to(AgentState.PLANNING)
    
    # Check history
    history = sm.context.execution_history
    assert len(history) == 3
    assert history[0]["from_state"] == AgentState.IDLE
    assert history[0]["to_state"] == AgentState.INITIALIZING
    assert history[1]["to_state"] == AgentState.ANALYZING
    
def test_error_state_transition():
    """Test transitions to and from error state"""
    sm = AgentStateMachine()
    
    # Get to ANALYZING state
    sm.transition_to(AgentState.INITIALIZING)
    sm.transition_to(AgentState.ANALYZING)
    
    # Transition to ERROR
    assert sm.can_transition_to(AgentState.ERROR)
    sm.transition_to(AgentState.ERROR)
    
    # Can only go to IDLE or TERMINATED from ERROR
    assert sm.can_transition_to(AgentState.IDLE)
    assert sm.can_transition_to(AgentState.TERMINATED)
    assert not sm.can_transition_to(AgentState.ANALYZING)

def test_termination():
    """Test agent termination"""
    sm = AgentStateMachine()
    
    # Can terminate from IDLE
    assert sm.can_transition_to(AgentState.TERMINATED)
    sm.transition_to(AgentState.TERMINATED)
    
    # Cannot transition from TERMINATED
    assert not sm.can_transition_to(AgentState.IDLE)
    assert not sm.can_transition_to(AgentState.INITIALIZING)