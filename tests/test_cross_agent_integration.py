import pytest
from datetime import datetime
from uuid import UUID
from typing import Dict, Any

from agents.cross_agent_learning import CrossAgentLearning
from agents.assessment_agent import LearningAssessmentAgent
from agents.analysis_agent import LearningAnalysisAgent
from agents.base import AgentContext

@pytest.fixture
def agent_context():
    return AgentContext(
        session_id=UUID('a' * 32),
        start_time=datetime.utcnow(),
        metadata={}
    )

@pytest.fixture
def cross_learning():
    return CrossAgentLearning()

@pytest.fixture
def assessment_agent(cross_learning):
    return LearningAssessmentAgent(
        name="test_assessment",
        cross_learning=cross_learning
    )

@pytest.fixture
def analysis_agent(cross_learning):
    return LearningAnalysisAgent(
        name="test_analysis",
        cross_learning=cross_learning
    )

@pytest.fixture
def mock_assessment_data():
    return {
        'parameters': {
            'assessment_type': 'motor_function',
            'protocol_version': '1.0',
            'client_age': 45,
            'assessment_area': 'upper_limb'
        }
    }

@pytest.fixture
def mock_analysis_data():
    return {
        'parameters': {
            'analysis_type': 'movement_data',
            'data_source': 'motion_capture',
            'metrics': ['range_of_motion', 'movement_quality'],
            'assessment_area': 'upper_limb'
        }
    }

class MockAssessmentAgent(LearningAssessmentAgent):
    """Mock assessment agent for testing"""
    async def _analyze_data_source(self, data_source: str):
        return None
        
    async def _execute_single_step(self, step: Dict[str, Any], context: AgentContext, parameters: Any):
        return {
            'success': True,
            'duration': 300,
            'measurements': {
                'rom': 85,
                'strength': 75
            }
        }
        
    def _get_assessment_protocol(self, assessment_type: str, version: str):
        return [
            {
                'id': 'step1',
                'type': 'measurement',
                'parameters': {}
            }
        ]
        
    def _generate_assessment_summary(self, step_results: Dict[str, Any], parameters: Any):
        return {
            'overall_score': 80,
            'recommendations': ['continue_therapy']
        }

class MockAnalysisAgent(LearningAnalysisAgent):
    """Mock analysis agent for testing"""
    async def _analyze_data_source(self, data_source: str):
        return None
        
    async def _execute_analysis(self, task: Dict[str, Any], parameters: Any):
        return {
            'metrics': {
                'range_of_motion': 0.85,
                'movement_quality': 0.78
            },
            'record_count': 100,
            'execution_time': 450
        }

@pytest.mark.asyncio
async def test_cross_agent_pattern_learning():
    """Test pattern learning between assessment and analysis agents"""
    cross_learning = CrossAgentLearning()
    
    assessment = MockAssessmentAgent(
        name="test_assessment",
        cross_learning=cross_learning
    )
    
    analysis = MockAnalysisAgent(
        name="test_analysis",
        cross_learning=cross_learning
    )
    
    context = agent_context()
    
    # Process multiple assessment and analysis tasks
    for i in range(5):
        assessment_data = mock_assessment_data()
        analysis_data = mock_analysis_data()
        
        # Run assessment
        assessment_result = await assessment.process_task(
            assessment_data, context
        )
        
        # Run analysis
        analysis_result = await analysis.process_task(
            analysis_data, context
        )
        
        assert assessment_result is not None
        assert analysis_result is not None
    
    # Check for cross-agent patterns
    cross_patterns = await cross_learning.analyze_cross_patterns(
        source_agent="assessment",
        target_agent="analysis",
        min_confidence=0.8
    )
    
    assert len(cross_patterns) > 0, "Should discover cross-agent patterns"
    
    # Verify pattern correlation
    pattern = cross_patterns[0]
    assert pattern.correlation_strength >= 0.75, "Should have strong correlation"
    assert 'assessment_area' in pattern.metadata['correlation_factors'], \
           "Should identify common assessment area"

@pytest.mark.asyncio
async def test_cross_agent_pattern_application():
    """Test application of learned patterns between agents"""
    cross_learning = CrossAgentLearning()
    
    assessment = MockAssessmentAgent(
        name="test_assessment",
        cross_learning=cross_learning
    )
    
    analysis = MockAnalysisAgent(
        name="test_analysis",
        cross_learning=cross_learning
    )
    
    context = agent_context()
    
    # First, generate some patterns
    for i in range(3):
        await assessment.process_task(mock_assessment_data(), context)
        await analysis.process_task(mock_analysis_data(), context)
    
    # Now try to process a new task with pattern application
    new_assessment_data = {
        'parameters': {
            'assessment_type': 'motor_function',
            'protocol_version': '1.0',
            'client_age': 50,
            # Intentionally omit assessment_area to test pattern application
        }
    }
    
    result = await assessment.process_task(new_assessment_data, context)
    
    assert result is not None, "Should process task successfully"
    assert 'assessment_area' in result['parameters'], \
           "Should apply learned assessment area from patterns"

@pytest.mark.asyncio
async def test_cross_agent_insights():
    """Test generation of cross-agent learning insights"""
    cross_learning = CrossAgentLearning()
    
    assessment = MockAssessmentAgent(
        name="test_assessment",
        cross_learning=cross_learning
    )
    
    analysis = MockAnalysisAgent(
        name="test_analysis",
        cross_learning=cross_learning
    )
    
    context = agent_context()
    
    # Generate some patterns
    for i in range(4):
        await assessment.process_task(mock_assessment_data(), context)
        await analysis.process_task(mock_analysis_data(), context)
    
    # Get insights from both agents
    assessment_insights = await assessment.get_assessment_insights()
    analysis_insights = await analysis.get_analysis_insights()
    
    # Verify assessment insights
    assert 'cross_agent_patterns' in assessment_insights, \
           "Should include cross-agent pattern count"
    assert 'assessment_correlations' in assessment_insights, \
           "Should include correlation information"
    
    # Verify analysis insights
    assert 'cross_agent_patterns' in analysis_insights, \
           "Should include cross-agent pattern count"
    assert 'cross_agent_impact' in analysis_insights, \
           "Should include impact metrics"

@pytest.mark.asyncio
async def test_pattern_evolution():
    """Test evolution of cross-agent patterns over time"""
    cross_learning = CrossAgentLearning()
    
    assessment = MockAssessmentAgent(
        name="test_assessment",
        cross_learning=cross_learning
    )
    
    analysis = MockAnalysisAgent(
        name="test_analysis",
        cross_learning=cross_learning
    )
    
    context = agent_context()
    
    # First batch of tasks
    for i in range(3):
        await assessment.process_task(mock_assessment_data(), context)
        await analysis.process_task(mock_analysis_data(), context)
    
    initial_patterns = await cross_learning.analyze_cross_patterns(
        source_agent="assessment",
        target_agent="analysis",
        min_confidence=0.8
    )
    
    # Second batch with slightly different data
    modified_assessment_data = mock_assessment_data()
    modified_assessment_data['parameters']['client_age'] = 60
    
    modified_analysis_data = mock_analysis_data()
    modified_analysis_data['parameters']['metrics'].append('balance')
    
    for i in range(3):
        await assessment.process_task(modified_assessment_data, context)
        await analysis.process_task(modified_analysis_data, context)
    
    evolved_patterns = await cross_learning.analyze_cross_patterns(
        source_agent="assessment",
        target_agent="analysis",
        min_confidence=0.8
    )
    
    assert len(evolved_patterns) >= len(initial_patterns), \
           "Should maintain or increase pattern count"
    
    # Check for pattern adaptation
    initial_correlations = [p.correlation_strength for p in initial_patterns]
    evolved_correlations = [p.correlation_strength for p in evolved_patterns]
    
    avg_initial = sum(initial_correlations) / len(initial_correlations) if initial_correlations else 0
    avg_evolved = sum(evolved_correlations) / len(evolved_correlations) if evolved_correlations else 0
    
    assert abs(avg_evolved - avg_initial) < 0.2, \
           "Pattern correlations should remain relatively stable"