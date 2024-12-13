import pytest
from fastapi import HTTPException
from datetime import datetime

from api.validation.agent_validator import AgentStateValidator
from api.schemas.agent_state import AgentStateStatus

@pytest.fixture
def valid_initial_state():
    return {
        "status": "initializing",
        "progress": 0,
        "last_updated": datetime.now().isoformat(),
        "metadata": {}
    }

@pytest.fixture
def valid_processing_state():
    return {
        "status": "processing",
        "progress": 50,
        "last_updated": datetime.now().isoformat(),
        "metadata": {"step": "assessment"}
    }

def test_valid_state_validation(valid_initial_state):
    validated = AgentStateValidator.validate_state(valid_initial_state)
    assert validated.status == AgentStateStatus.INITIALIZING
    assert validated.progress == 0

def test_invalid_state_validation():
    invalid_state = {"status": "unknown"}
    with pytest.raises(HTTPException) as exc_info:
        AgentStateValidator.validate_state(invalid_state)
    assert exc_info.value.status_code == 400

def test_valid_state_transition(valid_initial_state):
    new_state = {**valid_initial_state, "status": "ready"}
    AgentStateValidator.validate_transition(valid_initial_state, new_state)

def test_invalid_state_transition(valid_initial_state):
    new_state = {**valid_initial_state, "status": "completed"}
    with pytest.raises(HTTPException) as exc_info:
        AgentStateValidator.validate_transition(valid_initial_state, new_state)
    assert exc_info.value.status_code == 400

def test_progress_validation_processing():
    state = {
        "status": "processing",
        "last_updated": datetime.now().isoformat(),
        "metadata": {}
    }
    with pytest.raises(HTTPException) as exc_info:
        AgentStateValidator.validate_progress(state)
    assert exc_info.value.status_code == 400

def test_progress_validation_completed():
    state = {
        "status": "completed",
        "progress": 90,
        "last_updated": datetime.now().isoformat(),
        "metadata": {}
    }
    with pytest.raises(HTTPException) as exc_info:
        AgentStateValidator.validate_progress(state)
    assert exc_info.value.status_code == 400