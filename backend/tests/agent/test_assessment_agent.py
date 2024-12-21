import pytest
from agent.assessment_agent import AssessmentAgent
from agent.state_machine import AgentState

@pytest.fixture
def agent():
    """Create assessment agent instance"""
    return AssessmentAgent("test-assessment", {
        "templates_path": "test_templates"
    })

@pytest.fixture
def sample_client_data():
    """Sample client data for testing"""
    return {
        "age": 22,
        "medical_history": ["previous_crisis"],
        "support_system": {
            "family_support": False,
            "social_support": True
        },
        "risk_factors": ["substance_use"],
        "needs_interpreter": False
    }

@pytest.mark.asyncio
async def test_risk_factor_identification(agent, sample_client_data):
    """Test risk factor identification"""
    risk_factors = await agent._identify_risk_factors(sample_client_data)
    
    assert "young_adult" in risk_factors
    assert "crisis_history" in risk_factors
    assert len(risk_factors) >= 2

@pytest.mark.asyncio
async def test_assessment_tool_selection(agent, sample_client_data):
    """Test assessment tool selection"""
    tools = await agent._determine_assessment_tools("initial", sample_client_data)
    
    # Check base tools
    assert "basic_mental_health_screening" in tools
    assert "life_satisfaction_scale" in tools
    
    # Check type-specific tools
    assert "comprehensive_intake_form" in tools
    assert "risk_assessment_checklist" in tools
    
    # Check risk-based tools
    assert "substance_use_screening" in tools

@pytest.mark.asyncio
async def test_duration_estimation(agent, sample_client_data):
    """Test assessment duration estimation"""
    duration = await agent._estimate_duration("initial", sample_client_data)
    
    # Base duration for initial assessment (90) + risk adjustment
    assert duration > 90
    assert isinstance(duration, int)

@pytest.mark.asyncio
async def test_full_assessment_workflow(agent):
    """Test complete assessment workflow"""
    await agent.initialize()
    
    task = {
        "assessment_type": "initial",
        "client_data": {
            "age": 25,
            "medical_history": [],
            "support_system": {
                "family_support": True,
                "social_support": True
            },
            "risk_factors": []
        }
    }
    
    await agent.process_task(task)
    
    # Verify final state
    assert agent.state_machine.state == AgentState.IDLE
    assert agent.current_assessment is None

@pytest.mark.asyncio
async def test_assessment_analysis(agent):
    """Test assessment response analysis"""
    gathered_data = {
        "responses": {
            "basic_mental_health_screening": {
                "anxiety_level": "moderate",
                "depression_level": "low"
            },
            "risk_assessment_checklist": {
                "suicide_risk": "low",
                "self_harm_risk": "low"
            }
        }
    }
    
    analysis = await agent._analyze_responses(gathered_data)
    
    assert "risk_levels" in analysis
    assert "key_concerns" in analysis
    assert "recommendations" in analysis
    assert isinstance(analysis["follow_up_needed"], bool)

@pytest.mark.asyncio
async def test_report_generation(agent):
    """Test assessment report generation"""
    results = {
        "analysis": {
            "risk_levels": {
                "basic_mental_health_screening": "low",
                "risk_assessment_checklist": "low"
            },
            "key_concerns": ["mild_anxiety"],
            "recommendations": ["weekly_counseling"],
            "follow_up_needed": False
        }
    }
    
    report = await agent._generate_assessment_report(
        results,
        {"include_risk_factors": True, "include_recommendations": True}
    )
    
    assert "summary" in report
    assert "risk_factors" in report
    assert "recommendations" in report
    assert "follow_up" in report
    assert isinstance(report["follow_up"]["needed"], bool)