import pytest
from datetime import datetime
from uuid import uuid4

from agents.assessment.agent import AssessmentAgent
from agents.assessment.models import AssessmentStatus, AssessmentType
from api.repositories.agent_repository import EnhancedAgentRepository

@pytest.fixture
def mock_repository(mocker):
    repo = mocker.Mock(spec=EnhancedAgentRepository)
    repo.update_state = mocker.AsyncMock()
    return repo

@pytest.fixture
def assessment_agent(mock_repository):
    agent = AssessmentAgent(mock_repository)
    agent.agent_id = str(uuid4())
    return agent

@pytest.mark.asyncio
async def test_initialize_assessment(assessment_agent):
    # Initialize assessment
    assessment = await assessment_agent.initialize_assessment(
        patient_id="test_patient",
        protocol_id="basic_protocol",
        assessment_type="initial"
    )
    
    assert assessment.patient_id == "test_patient"
    assert assessment.protocol_id == "basic_protocol"
    assert assessment.status == AssessmentStatus.PENDING
    assert assessment.started_at is not None
    
    # Verify repository state update
    assessment_agent.repository.update_state.assert_called_once()

@pytest.mark.asyncio
async def test_start_assessment(assessment_agent):
    # First initialize
    await assessment_agent.initialize_assessment(
        patient_id="test_patient",
        protocol_id="basic_protocol",
        assessment_type="initial"
    )
    
    # Then start
    assessment = await assessment_agent.start_assessment()
    
    assert assessment.status == AssessmentStatus.IN_PROGRESS
    assert assessment.current_step is not None
    assert len(assessment_agent.repository.update_state.mock_calls) == 2

@pytest.mark.asyncio
async def test_record_step_data(assessment_agent):
    # Setup assessment
    await assessment_agent.initialize_assessment(
        patient_id="test_patient",
        protocol_id="basic_protocol",
        assessment_type="initial"
    )
    await assessment_agent.start_assessment()
    
    # Record step data
    step_data = {"key": "value"}
    assessment = await assessment_agent.record_step_data("patient_info", step_data)
    
    assert "patient_info" in assessment.completed_steps
    assert assessment.data["patient_info"] == step_data

@pytest.mark.asyncio
async def test_complete_assessment(assessment_agent):
    # Setup and complete all steps
    await assessment_agent.initialize_assessment(
        patient_id="test_patient",
        protocol_id="basic_protocol",
        assessment_type="initial"
    )
    await assessment_agent.start_assessment()
    
    # Complete all required steps
    steps = ["patient_info", "cognitive_assessment", "physical_assessment"]
    for step in steps:
        await assessment_agent.record_step_data(step, {"completed": True})
    
    # Complete assessment
    assessment = await assessment_agent.complete_assessment()
    
    assert assessment.status == AssessmentStatus.COMPLETED
    assert assessment.completed_at is not None

@pytest.mark.asyncio
async def test_pause_assessment(assessment_agent):
    # Setup assessment
    await assessment_agent.initialize_assessment(
        patient_id="test_patient",
        protocol_id="basic_protocol",
        assessment_type="initial"
    )
    await assessment_agent.start_assessment()
    
    # Pause assessment
    assessment = await assessment_agent.pause_assessment()
    
    assert assessment.status == AssessmentStatus.PAUSED

@pytest.mark.asyncio
async def test_invalid_step_id(assessment_agent):
    # Setup assessment
    await assessment_agent.initialize_assessment(
        patient_id="test_patient",
        protocol_id="basic_protocol",
        assessment_type="initial"
    )
    await assessment_agent.start_assessment()
    
    # Try to record data for invalid step
    with pytest.raises(ValueError, match="Invalid step ID"):
        await assessment_agent.record_step_data("invalid_step", {"data": "value"})

@pytest.mark.asyncio
async def test_complete_with_missing_steps(assessment_agent):
    # Setup assessment without completing all steps
    await assessment_agent.initialize_assessment(
        patient_id="test_patient",
        protocol_id="basic_protocol",
        assessment_type="initial"
    )
    await assessment_agent.start_assessment()
    
    # Try to complete without required steps
    with pytest.raises(ValueError, match="Missing required steps"):
        await assessment_agent.complete_assessment()