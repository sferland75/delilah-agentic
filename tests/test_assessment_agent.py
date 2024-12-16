import pytest
from uuid import uuid4
from models.assessment import AssessmentType, AssessmentStatus
from agents.assessment_agent import AssessmentAgent
from repositories.assessment import AssessmentRepository

@pytest.mark.asyncio
async def test_start_assessment(session):
    # Arrange
    agent = AssessmentAgent(session)
    client_id = uuid4()
    therapist_id = uuid4()
    assessment_type = AssessmentType.ADL
    
    # Act
    session_id = await agent.start_assessment(
        client_id=client_id,
        therapist_id=therapist_id,
        assessment_type=assessment_type
    )
    
    # Assert
    repo = AssessmentRepository(session)
    assessment = await repo.get_assessment(session_id)
    assert assessment is not None
    assert assessment.client_id == client_id
    assert assessment.therapist_id == therapist_id
    assert assessment.type == assessment_type
    assert assessment.status == AssessmentStatus.IN_PROGRESS
    
    # Check message was created
    messages = await repo.get_assessment_messages(session_id)
    assert len(messages) == 1
    assert messages[0].type == 'assessment_started'

@pytest.mark.asyncio
async def test_get_next_step(session):
    # Arrange
    agent = AssessmentAgent(session)
    client_id = uuid4()
    therapist_id = uuid4()
    assessment_type = AssessmentType.ADL
    
    # Act
    session_id = await agent.start_assessment(
        client_id=client_id,
        therapist_id=therapist_id,
        assessment_type=assessment_type
    )
    
    step = await agent.get_next_step(session_id)
    
    # Assert
    assert step is not None
    assert step.id == "bathing"
    assert step.input_type == "scale"
    
@pytest.mark.asyncio
async def test_submit_step(session):
    # Arrange
    agent = AssessmentAgent(session)
    client_id = uuid4()
    therapist_id = uuid4()
    assessment_type = AssessmentType.ADL
    
    session_id = await agent.start_assessment(
        client_id=client_id,
        therapist_id=therapist_id,
        assessment_type=assessment_type
    )
    
    # Act
    completed = await agent.submit_step(
        session_id=session_id,
        step_data={
            "id": "bathing",
            "value": "Independent"
        }
    )
    
    # Assert
    repo = AssessmentRepository(session)
    assessment = await repo.get_assessment(session_id)
    assert assessment.current_step == 1
    assert assessment.steps_data['1']['value'] == 'Independent'
    assert not completed  # Not completed as there are more steps
    
    # Check message was created
    messages = await repo.get_assessment_messages(session_id)
    assert len(messages) == 2  # started + step completed
    assert messages[1].type == 'step_completed'

@pytest.mark.asyncio
async def test_complete_assessment(session):
    # Arrange
    agent = AssessmentAgent(session)
    client_id = uuid4()
    therapist_id = uuid4()
    assessment_type = AssessmentType.ADL
    
    session_id = await agent.start_assessment(
        client_id=client_id,
        therapist_id=therapist_id,
        assessment_type=assessment_type
    )
    
    # Submit all steps
    await agent.submit_step(
        session_id=session_id,
        step_data={
            "id": "bathing",
            "value": "Independent"
        }
    )
    
    completed = await agent.submit_step(
        session_id=session_id,
        step_data={
            "id": "bathing_notes",
            "value": "Client demonstrates full independence in bathing activities"
        }
    )
    
    # Assert
    assert completed  # Should be true as all steps are complete
    
    repo = AssessmentRepository(session)
    assessment = await repo.get_assessment(session_id)
    assert assessment.status == AssessmentStatus.COMPLETED
    assert assessment.current_step == 2
    
    # Check all messages were created
    messages = await repo.get_assessment_messages(session_id)
    assert len(messages) == 4  # started + 2 steps + completed
    assert messages[-1].type == 'assessment_completed'