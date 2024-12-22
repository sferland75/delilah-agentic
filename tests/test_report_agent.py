import pytest
from datetime import datetime
from uuid import uuid4
from agents.report_agent import LearningReportAgent, ReportParameters, ReportTemplate
from agents.base import AgentContext

class TestReportAgent:
    @pytest.fixture
    def test_template(self):
        return ReportTemplate(
            template_id="test_template",
            sections=["summary", "analysis", "recommendations"],
            required_data=["client_data", "assessment_results"],
            formatting={
                "font": "Arial",
                "size": 12,
                "spacing": 1.5
            }
        )

    @pytest.fixture
    def test_parameters(self):
        return ReportParameters(
            report_type="assessment_report",
            template_id="test_template",
            data_sources=["client_db", "assessment_db"],
            target_format="pdf"
        )

    @pytest.fixture
    def agent(self, test_template):
        agent = LearningReportAgent(name="test_report_agent")
        # Override abstract methods for testing
        agent._generate_section_content = self.mock_generate_section_content
        # Register test template
        agent._templates[test_template.template_id] = test_template
        return agent

    @pytest.fixture
    def test_context(self):
        return AgentContext(
            session_id=uuid4(),
            user_id=uuid4(),
            therapist_id=uuid4(),
            client_id=uuid4()
        )

    async def mock_generate_section_content(self, params: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "type": "text",
            "content": f"Generated content for section {params['section']}",
            "metadata": {
                "generated_at": datetime.utcnow().isoformat()
            }
        }

    @pytest.mark.asyncio
    async def test_report_generation(self, agent, test_context, test_parameters):
        # Create test task
        task = {
            "parameters": test_parameters.dict(),
            "context_id": test_context.session_id
        }

        # Start session
        session_id = await agent.start_session(test_context)

        try:
            # Generate report
            result = await agent.process_task(task, test_context)

            # Verify result structure
            assert "report_type" in result
            assert "template_id" in result
            assert "sections" in result
            assert "metadata" in result

            # Verify all sections were generated
            for section in agent._templates[test_parameters.template_id].sections:
                assert section in result["sections"]

            # Verify learning system integration
            insights = await agent.get_report_insights(
                report_type=test_parameters.report_type
            )
            assert "templates_available" in insights
            assert "report_patterns" in insights
            assert "performance_metrics" in insights

        finally:
            await agent.end_session(session_id)

    @pytest.mark.asyncio
    async def test_pattern_learning(self, agent, test_context, test_parameters):
        task = {
            "parameters": test_parameters.dict(),
            "context_id": test_context.session_id
        }

        # Generate multiple reports to build patterns
        for _ in range(5):
            session_id = await agent.start_session(test_context)
            try:
                await agent.process_task(task, test_context)
            finally:
                await agent.end_session(session_id)

        # Get insights
        insights = await agent.get_report_insights(
            report_type=test_parameters.report_type
        )

        # Verify pattern learning
        assert insights["report_patterns"] > 0
        performance = insights["performance_metrics"]
        assert performance["status"] in {"active", "insufficient_data"}

        if performance["status"] == "active":
            assert "successful_patterns" in performance
            assert "avg_duration_improvement" in performance
            assert "optimization_coverage" in performance

    @pytest.mark.asyncio
    async def test_section_optimization(self, agent, test_context, test_parameters):
        task = {
            "parameters": test_parameters.dict(),
            "context_id": test_context.session_id
        }

        # Generate initial reports to establish baseline
        for _ in range(3):
            session_id = await agent.start_session(test_context)
            try:
                await agent.process_task(task, test_context)
            finally:
                await agent.end_session(session_id)

        # Verify section-specific patterns
        template = agent._templates[test_parameters.template_id]
        for section in template.sections:
            patterns = await agent.learning_core.get_patterns(
                event_type=f"report_section_{section}"
            )
            assert len(patterns) > 0

    @pytest.mark.asyncio
    async def test_error_handling(self, agent, test_context, test_parameters):
        # Override section generation to simulate error
        async def error_generation(*args):
            raise ValueError("Test error in section generation")

        agent._generate_section_content = error_generation

        task = {
            "parameters": test_parameters.dict(),
            "context_id": test_context.session_id
        }

        session_id = await agent.start_session(test_context)

        try:
            # Verify error handling
            with pytest.raises(ValueError):
                await agent.process_task(task, test_context)

            # Verify error was recorded in learning system
            insights = await agent.get_report_insights(
                report_type=test_parameters.report_type
            )
            assert insights["performance_metrics"]["status"] != "active"

        finally:
            await agent.end_session(session_id)

    @pytest.mark.asyncio
    async def test_template_management(self, agent, test_template):
        # Test template registration
        new_template = ReportTemplate(
            template_id="new_template",
            sections=["executive_summary", "details"],
            required_data=["client_data"],
            formatting={"font": "Times", "size": 11}
        )

        await agent.register_template(new_template)
        assert new_template.template_id in agent._templates

        # Verify template counts in insights
        insights = await agent.get_report_insights()
        assert insights["templates_available"] == 2  # test_template + new_template