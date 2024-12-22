import pytest
from uuid import UUID, uuid4
from datetime import datetime
from agents.assessment_agent import LearningAssessmentAgent, AssessmentParameters
from agents.base import AgentContext

@pytest.fixture
def test_assessment_parameters():
    return AssessmentParameters(
        assessment_type="functional_mobility",
        protocol_version="1.0",
        client_age=35,
        assessment_area="upper_extremity"
    )

@pytest.fixture
def mock_assessment_protocol():
    return [
        {
            'id': 'step1',
            'name': 'Range of Motion',
            'requirements': ['goniometer']
        },
        {
            'id': 'step2',
            'name': 'Muscle Strength',
            'requirements': ['resistance_bands']
        }
    ]

class TestAssessmentAgent:
    
    @pytest.fixture
    def agent(self):
        agent = LearningAssessmentAgent(name="test_assessment_agent")
        # Override abstract methods for testing
        agent._get_assessment_protocol = lambda type, version: mock_assessment_protocol()
        agent._execute_single_step = self.mock_execute_step
        agent._generate_assessment_summary = self.mock_generate_summary
        return agent

    async def mock_execute_step(self, step, context, parameters):
        return {
            'step_id': step['id'],
            'success': True,
            'duration': 1.5,
            'measurements': {'value': 95}
        }

    def mock_generate_summary(self, step_results, parameters):
        return {
            'overall_status': 'completed',
            'recommendations': ['continue_monitoring']
        }

    @pytest.mark.asyncio
    async def test_assessment_execution(self, agent, test_assessment_parameters):
        # Create test context
        context = AgentContext(
            session_id=uuid4(),
            user_id=uuid4(),
            therapist_id=uuid4(),
            client_id=uuid4()
        )

        # Create test task
        task = {
            'parameters': test_assessment_parameters.dict()
        }

        # Start session
        session_id = await agent.start_session(context)

        try:
            # Process assessment task
            result = await agent.process_task(task, context)

            # Verify assessment execution
            assert 'assessment_type' in result
            assert result['assessment_type'] == test_assessment_parameters.assessment_type
            assert 'steps' in result
            assert all(step['success'] for step in result['steps'].values())
            assert 'summary' in result

            # Verify learning system integration
            insights = await agent.get_assessment_insights(
                assessment_type=test_assessment_parameters.assessment_type
            )
            assert 'assessment_patterns' in insights

        finally:
            await agent.end_session(session_id)

    @pytest.mark.asyncio
    async def test_assessment_error_handling(self, agent, test_assessment_parameters):
        # Create test context
        context = AgentContext(
            session_id=uuid4(),
            user_id=uuid4(),
            therapist_id=uuid4(),
            client_id=uuid4()
        )

        # Override step execution to simulate error
        async def error_step(*args):
            raise ValueError("Test error")

        agent._execute_single_step = error_step

        # Start session
        session_id = await agent.start_session(context)

        try:
            # Process assessment task
            with pytest.raises(ValueError):
                await agent.process_task(
                    {'parameters': test_assessment_parameters.dict()},
                    context
                )

            # Verify error was recorded in learning system
            insights = await agent.get_assessment_insights(
                assessment_type=test_assessment_parameters.assessment_type
            )
            assert insights['success_rate'] == 0

        finally:
            await agent.end_session(session_id)

    @pytest.mark.asyncio
    async def test_assessment_learning(self, agent, test_assessment_parameters):
        # Create test context
        context = AgentContext(
            session_id=uuid4(),
            user_id=uuid4(),
            therapist_id=uuid4(),
            client_id=uuid4()
        )

        # Execute multiple successful assessments to generate patterns
        task = {'parameters': test_assessment_parameters.dict()}

        for _ in range(5):
            session_id = await agent.start_session(context)
            try:
                await agent.process_task(task, context)
            finally:
                await agent.end_session(session_id)

        # Verify learning patterns were generated
        insights = await agent.get_assessment_insights(
            assessment_type=test_assessment_parameters.assessment_type
        )
        assert insights['assessment_patterns'] > 0
        assert insights['success_rate'] > 0