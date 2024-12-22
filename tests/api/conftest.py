import pytest
from typing import Dict, Any
from datetime import datetime
from uuid import UUID

from agents.cross_agent_learning import CrossAgentLearning
from agents.learning_core import AgentLearningCore, LearningPattern
from agents.base import AgentType

@pytest.fixture(scope="session")
def mock_learning_pattern() -> Dict[str, Any]:
    """Create mock learning pattern data"""
    return {
        'pattern_type': 'assessment_pattern',
        'confidence': 0.85,
        'supporting_events': [UUID('a' * 32)],
        'metadata': {
            'common_factors': {
                'assessment_area': 'upper_limb',
                'protocol': 'standard'
            },
            'success_rate': 0.82
        }
    }

@pytest.fixture(scope="session")
def mock_cross_pattern() -> Dict[str, Any]:
    """Create mock cross-agent pattern data"""
    return {
        'source_patterns': [UUID('a' * 32), UUID('b' * 32)],
        'agent_types': {AgentType.ASSESSMENT.value, AgentType.ANALYSIS.value},
        'correlation_strength': 0.88,
        'pattern_signature': 'test_pattern',
        'source_agent': AgentType.ASSESSMENT.value,
        'target_agent': AgentType.ANALYSIS.value,
        'metadata': {
            'source_metadata': {
                'common_factors': {
                    'assessment_area': 'upper_limb'
                }
            },
            'target_metadata': {
                'common_factors': {
                    'analysis_area': 'upper_limb'
                }
            },
            'correlation_factors': {
                'area': 'upper_limb'
            }
        }
    }

@pytest.fixture
def mock_learning_cores():
    """Create mock learning cores for testing"""
    cores = {}
    for agent_type in [AgentType.ASSESSMENT, AgentType.ANALYSIS]:
        core = AgentLearningCore()
        cores[agent_type.value] = core
    return cores

@pytest.fixture
def setup_cross_learning(mock_learning_cores, mock_learning_pattern):
    """Setup CrossAgentLearning with mock data"""
    cal = CrossAgentLearning.get_instance()
    
    # Register mock cores
    for agent_type, core in mock_learning_cores.items():
        cal.register_agent(agent_type, core)
        
    return cal

@pytest.fixture
async def populate_test_data(setup_cross_learning, mock_learning_pattern):
    """Populate test data for API testing"""
    cal = setup_cross_learning
    
    # Add some test patterns
    await cal.analyze_cross_patterns(
        source_agent=AgentType.ASSESSMENT.value,
        target_agent=AgentType.ANALYSIS.value,
        min_confidence=0.8
    )