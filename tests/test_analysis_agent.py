import pytest
from datetime import datetime
from uuid import uuid4
from agents.analysis_agent import LearningAnalysisAgent, AnalysisParameters, DataSourceStats
from agents.base import AgentContext

class TestAnalysisAgent:
    @pytest.fixture
    def agent(self):
        agent = LearningAnalysisAgent(name="test_analysis_agent")
        # Override abstract methods for testing
        agent._analyze_data_source = self.mock_analyze_data_source
        agent._execute_analysis = self.mock_execute_analysis
        return agent

    @pytest.fixture
    def test_context(self):
        return AgentContext(
            session_id=uuid4(),
            user_id=uuid4(),
            therapist_id=uuid4(),
            client_id=uuid4()
        )

    @pytest.fixture
    def test_parameters(self):
        return AnalysisParameters(
            analysis_type="test_analysis",
            data_source="test_source",
            metrics=["metric1", "metric2"],
            filters={"field": "value"},
            aggregations={"field": "sum"}
        )

    async def mock_analyze_data_source(self, data_source: str) -> DataSourceStats:
        return DataSourceStats(
            total_records=1000,
            field_types={"field1": "numeric", "field2": "categorical"},
            value_ranges={"field1": {"min": 0, "max": 100}},
            missing_values={"field1": 0, "field2": 5}
        )

    async def mock_execute_analysis(self, task: Dict[str, Any], parameters: AnalysisParameters) -> Dict[str, Any]:
        return {
            "metrics": {"metric1": 42, "metric2": 84},
            "record_count": 1000,
            "execution_time": 1.5,
            "optimizations_used": ["opt1", "opt2"]
        }

    @pytest.mark.asyncio
    async def test_analysis_execution(self, agent, test_context, test_parameters):
        # Create test task
        task = {
            "parameters": test_parameters.dict()
        }

        # Start session
        session_id = await agent.start_session(test_context)

        try:
            # Execute analysis
            result = await agent.process_task(task, test_context)

            # Verify result structure
            assert "metrics" in result
            assert "record_count" in result
            assert "execution_time" in result
            assert "optimizations_used" in result

            # Verify learning system integration
            insights = await agent.get_analysis_insights(
                analysis_type=test_parameters.analysis_type
            )
            assert "data_sources_analyzed" in insights
            assert "analysis_patterns" in insights
            assert "optimization_impact" in insights

        finally:
            await agent.end_session(session_id)

    @pytest.mark.asyncio
    async def test_pattern_learning(self, agent, test_context, test_parameters):
        task = {"parameters": test_parameters.dict()}

        # Execute multiple analyses to generate patterns
        for _ in range(5):
            session_id = await agent.start_session(test_context)
            try:
                await agent.process_task(task, test_context)
            finally:
                await agent.end_session(session_id)

        # Get insights
        insights = await agent.get_analysis_insights(
            analysis_type=test_parameters.analysis_type
        )

        # Verify pattern learning
        assert insights["analysis_patterns"] > 0
        assert insights["data_sources_analyzed"] > 0

        # Verify optimization impact
        impact = insights["optimization_impact"]
        assert impact["status"] in {"active", "insufficient_data"}
        if impact["status"] == "active":
            assert "avg_duration_improvement" in impact
            assert "successful_patterns" in impact

    @pytest.mark.asyncio
    async def test_error_handling(self, agent, test_context, test_parameters):
        # Override execute_analysis to simulate error
        async def error_analysis(*args):
            raise ValueError("Test error")

        agent._execute_analysis = error_analysis

        task = {"parameters": test_parameters.dict()}
        session_id = await agent.start_session(test_context)

        try:
            # Verify error handling
            with pytest.raises(ValueError):
                await agent.process_task(task, test_context)

            # Verify error was recorded in learning system
            insights = await agent.get_analysis_insights(
                analysis_type=test_parameters.analysis_type
            )
            assert insights["optimization_impact"]["status"] != "active"

        finally:
            await agent.end_session(session_id)

    @pytest.mark.asyncio
    async def test_data_source_caching(self, agent, test_context, test_parameters):
        task = {"parameters": test_parameters.dict()}

        # First execution should analyze data source
        session_id = await agent.start_session(test_context)
        try:
            result1 = await agent.process_task(task, test_context)
        finally:
            await agent.end_session(session_id)

        # Track number of data source analyses
        analysis_count = len(agent._data_source_stats)

        # Second execution should use cached stats
        session_id = await agent.start_session(test_context)
        try:
            result2 = await agent.process_task(task, test_context)
        finally:
            await agent.end_session(session_id)

        # Verify data source wasn't re-analyzed
        assert len(agent._data_source_stats) == analysis_count