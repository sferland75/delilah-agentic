import pytest
from datetime import datetime
from uuid import UUID
from typing import Dict, Any

from agents.cross_agent_learning import CrossAgentLearning, CrossAgentPattern
from agents.learning_core import AgentLearningCore, LearningPattern
from agents.base import AgentType

@pytest.fixture
def assessment_core():
    return AgentLearningCore()

@pytest.fixture
def analysis_core():
    return AgentLearningCore()

@pytest.fixture
def cross_learning(assessment_core, analysis_core):
    cal = CrossAgentLearning()
    cal.register_agent(AgentType.ASSESSMENT.value, assessment_core)
    cal.register_agent(AgentType.ANALYSIS.value, analysis_core)
    return cal

@pytest.fixture
async def assessment_patterns(assessment_core):
    """Create test patterns for assessment agent"""
    patterns = []
    
    # Record successful assessment events
    await assessment_core.record_event(
        event_type="assessment_motor_function",
        context_id=UUID('a' * 32),
        data={
            'client_age': 45,
            'assessment_area': 'upper_limb',
            'protocol': 'standard'
        },
        outcome={
            'success': True,
            'duration': 1200,
            'score': 85
        }
    )
    
    await assessment_core.record_event(
        event_type="assessment_motor_function",
        context_id=UUID('b' * 32),
        data={
            'client_age': 42,
            'assessment_area': 'upper_limb',
            'protocol': 'standard'
        },
        outcome={
            'success': True,
            'duration': 1180,
            'score': 82
        }
    )
    
    return await assessment_core.get_patterns()

@pytest.fixture
async def analysis_patterns(analysis_core):
    """Create test patterns for analysis agent"""
    # Record successful analysis events
    await analysis_core.record_event(
        event_type="analysis_movement_data",
        context_id=UUID('c' * 32),
        data={
            'data_source': 'motion_capture',
            'metrics': ['range_of_motion', 'movement_quality'],
            'assessment_area': 'upper_limb'
        },
        outcome={
            'success': True,
            'duration': 450,
            'findings': {
                'rom_score': 0.82,
                'quality_score': 0.75
            }
        }
    )
    
    await analysis_core.record_event(
        event_type="analysis_movement_data",
        context_id=UUID('d' * 32),
        data={
            'data_source': 'motion_capture',
            'metrics': ['range_of_motion', 'movement_quality'],
            'assessment_area': 'upper_limb'
        },
        outcome={
            'success': True,
            'duration': 460,
            'findings': {
                'rom_score': 0.84,
                'quality_score': 0.78
            }
        }
    )
    
    return await analysis_core.get_patterns()

@pytest.mark.asyncio
async def test_cross_pattern_analysis(cross_learning, assessment_patterns, analysis_patterns):
    """Test cross-agent pattern analysis"""
    # Analyze patterns between agents
    cross_patterns = await cross_learning.analyze_cross_patterns(
        source_agent=AgentType.ASSESSMENT.value,
        target_agent=AgentType.ANALYSIS.value,
        min_confidence=0.8
    )
    
    assert len(cross_patterns) > 0, "Should identify cross-agent patterns"
    
    pattern = cross_patterns[0]
    assert pattern.correlation_strength >= 0.75, "Should have strong correlation"
    assert 'assessment_area' in pattern.metadata['correlation_factors'], \
           "Should identify common assessment area factor"
           
    # Test pattern application
    test_data = {
        'client_id': 'test123',
        'assessment_type': 'motor_function'
    }
    
    enhanced_data = await cross_learning.apply_cross_pattern(
        pattern_id=pattern.source_patterns[0],
        agent_type=AgentType.ASSESSMENT.value,
        data=test_data
    )
    
    assert enhanced_data != test_data, "Should enhance data with pattern"
    assert 'assessment_area' in enhanced_data, "Should add correlated factors"

@pytest.mark.asyncio
async def test_pattern_correlation_calculation(cross_learning):
    """Test pattern correlation strength calculation"""
    pattern1 = LearningPattern(
        pattern_type="assessment_motor_function",
        confidence=0.9,
        supporting_events=[UUID('a' * 32)],
        metadata={
            'common_factors': {
                'assessment_area': 'upper_limb',
                'protocol': 'standard'
            },
            'success_rate': 0.85
        }
    )
    
    pattern2 = LearningPattern(
        pattern_type="analysis_movement_data",
        confidence=0.85,
        supporting_events=[UUID('b' * 32)],
        metadata={
            'common_factors': {
                'assessment_area': 'upper_limb',
                'data_source': 'motion_capture'
            },
            'success_rate': 0.82
        }
    )
    
    correlation = await cross_learning._calculate_pattern_correlation(pattern1, pattern2)
    
    assert correlation > 0, "Should calculate positive correlation"
    assert correlation <= 1.0, "Correlation should be normalized"
    
    # Test with no common factors
    pattern2.metadata['common_factors'] = {'data_source': 'motion_capture'}
    correlation = await cross_learning._calculate_pattern_correlation(pattern1, pattern2)
    assert correlation == 0, "Should return zero correlation when no common factors"

@pytest.mark.asyncio
async def test_cross_pattern_signature(cross_learning):
    """Test cross-pattern signature generation"""
    pattern1 = LearningPattern(
        pattern_type="assessment_motor_function",
        confidence=0.9,
        supporting_events=[UUID('a' * 32)],
        metadata={
            'common_factors': {
                'assessment_area': 'upper_limb',
                'protocol': 'standard'
            }
        }
    )
    
    pattern2 = LearningPattern(
        pattern_type="analysis_movement_data",
        confidence=0.85,
        supporting_events=[UUID('b' * 32)],
        metadata={
            'common_factors': {
                'assessment_area': 'upper_limb',
                'data_source': 'motion_capture'
            }
        }
    )
    
    signature = cross_learning._generate_pattern_signature(pattern1, pattern2)
    
    assert 'assessment_motor_function' in signature, "Should include source pattern type"
    assert 'analysis_movement_data' in signature, "Should include target pattern type"
    assert 'assessment_area:upper_limb' in signature, "Should include common factors"

@pytest.mark.asyncio
async def test_cross_pattern_application_validation(cross_learning):
    """Test validation in cross-pattern application"""
    with pytest.raises(ValueError):
        await cross_learning.apply_cross_pattern(
            pattern_id=UUID('a' * 32),
            agent_type=AgentType.ASSESSMENT.value,
            data={}
        )
    
    pattern = CrossAgentPattern(
        source_patterns=[UUID('a' * 32)],
        agent_types={AgentType.ASSESSMENT.value},
        correlation_strength=0.8,
        pattern_signature="test:test"
    )
    
    cross_learning._cross_patterns[UUID('a' * 32)] = pattern
    
    with pytest.raises(ValueError):
        await cross_learning.apply_cross_pattern(
            pattern_id=UUID('a' * 32),
            agent_type=AgentType.ANALYSIS.value,
            data={}
        )