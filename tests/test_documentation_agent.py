import pytest
from datetime import datetime
from uuid import uuid4
from typing import Dict, Any
from agents.documentation_agent import (
    LearningDocumentationAgent,
    DocumentationParameters,
    DocumentationStructure
)
from agents.base import AgentContext

class TestDocumentationAgent:
    @pytest.fixture
    def test_structure(self):
        return DocumentationStructure(
            structure_id="test_structure",
            sections=["overview", "methodology", "findings"],
            required_fields=["client_info", "assessment_data"],
            optional_fields=["additional_notes"],
            templates={
                "overview": "# Overview\n{client_info}\n",
                "methodology": "## Methodology\n{assessment_approach}\n",
                "findings": "## Findings\n{assessment_results}\n"
            }
        )

    @pytest.fixture
    def test_parameters(self):
        return DocumentationParameters(
            doc_type="assessment_documentation",
            structure_id="test_structure",
            data_sources=["client_records", "assessment_data"],
            target_format="markdown"
        )

    @pytest.fixture
    def agent(self, test_structure):
        agent = LearningDocumentationAgent(name="test_documentation_agent")
        # Override abstract methods for testing
        agent._generate_section_content = self.mock_generate_section_content
        # Register test structure
        agent._structures[test_structure.structure_id] = test_structure
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
            "content_type": "markdown",
            "content": f"Generated content for {params['section']} section",
            "metadata": {
                "template_used": bool(params.get('template')),
                "generated_at": datetime.utcnow().isoformat()
            }
        }

    @pytest.mark.asyncio
    async def test_documentation_generation(self, agent, test_context, test_parameters):
        # Create test task
        task = {
            "parameters": test_parameters.dict(),
            "context_id": test_context.session_id
        }

        # Start session
        session_id = await agent.start_session(test_context)

        try:
            # Generate documentation
            result = await agent.process_task(task, test_context)

            # Verify result structure
            assert "doc_type" in result
            assert "structure_id" in result
            assert "content" in result
            assert "metadata" in result

            # Verify all sections were generated
            for section in agent._structures[test_parameters.structure_id].sections:
                assert section in result["content"]
                section_content = result["content"][section]
                assert "content_type" in section_content
                assert "content" in section_content

            # Verify learning system integration
            insights = await agent.get_documentation_insights(
                doc_type=test_parameters.doc_type
            )
            assert "structures_available" in insights
            assert "documentation_patterns" in insights
            assert "optimization_efficiency" in insights

        finally:
            await agent.end_session(session_id)

    @pytest.mark.asyncio
    async def test_pattern_learning(self, agent, test_context, test_parameters):
        task = {
            "parameters": test_parameters.dict(),
            "context_id": test_context.session_id
        }

        # Generate multiple documents to build patterns
        for _ in range(5):
            session_id = await agent.start_session(test_context)
            try:
                await agent.process_task(task, test_context)
            finally:
                await agent.end_session(session_id)

        # Get insights
        insights = await agent.get_documentation_insights(
            doc_type=test_parameters.doc_type
        )

        # Verify pattern learning
        assert insights["documentation_patterns"] > 0
        efficiency = insights["optimization_efficiency"]
        assert efficiency["status"] in {"active", "insufficient_data"}

        if efficiency["status"] == "active":
            assert "successful_patterns" in efficiency
            assert "avg_time_saving" in efficiency
            assert "avg_quality_improvement" in efficiency

    @pytest.mark.asyncio
    async def test_section_optimization(self, agent, test_context, test_parameters):
        task = {
            "parameters": test_parameters.dict(),
            "context_id": test_context.session_id
        }

        # Generate initial documentation to establish baseline
        for _ in range(3):
            session_id = await agent.start_session(test_context)
            try:
                await agent.process_task(task, test_context)
            finally:
                await agent.end_session(session_id)

        # Verify section-specific patterns
        structure = agent._structures[test_parameters.structure_id]
        for section in structure.sections:
            patterns = await agent.learning_core.get_patterns(
                event_type=f"documentation_section_{section}"
            )
            assert len(patterns) > 0

    @pytest.mark.asyncio
    async def test_error_handling(self, agent, test_context, test_parameters):
        # Override section generation to simulate error
        async def error_generation(*args):
            raise ValueError("Test error in documentation generation")

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
            insights = await agent.get_documentation_insights(
                doc_type=test_parameters.doc_type
            )
            assert insights["optimization_efficiency"]["status"] != "active"

        finally:
            await agent.end_session(session_id)

    @pytest.mark.asyncio
    async def test_structure_management(self, agent, test_structure):
        # Test structure registration
        new_structure = DocumentationStructure(
            structure_id="new_structure",
            sections=["summary", "details"],
            required_fields=["patient_data"],
            optional_fields=["notes"],
            templates={"summary": "# Summary\n{data}"}
        )

        await agent.register_structure(new_structure)
        assert new_structure.structure_id in agent._structures

        # Verify structure counts in insights
        insights = await agent.get_documentation_insights()
        assert insights["structures_available"] == 2  # test_structure + new_structure

    @pytest.mark.asyncio
    async def test_template_application(self, agent, test_context, test_parameters):
        task = {
            "parameters": test_parameters.dict(),
            "context_id": test_context.session_id,
            "data": {
                "client_info": "Test Client",
                "assessment_approach": "Standard Protocol",
                "assessment_results": "All tests completed successfully"
            }
        }

        session_id = await agent.start_session(test_context)
        try:
            result = await agent.process_task(task, test_context)
            
            # Verify template application
            for section in result["content"]:
                assert result["content"][section]["metadata"]["template_used"] == \
                       (section in agent._structures[test_parameters.structure_id].templates)
        finally:
            await agent.end_session(session_id)