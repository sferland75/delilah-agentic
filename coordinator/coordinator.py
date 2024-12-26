import asyncio
from typing import Dict, Any, Optional
from uuid import UUID
import logging

from agents.assessment_agent import AssessmentAgent
from agents.documentation_agent import DocumentationAgent
from agents.analysis_agent import AnalysisAgent
from agents.report_agent import ReportAgent
from coordinator.queue_manager import MessageQueue

logger = logging.getLogger(__name__)

class AgentCoordinator:
    def __init__(self):
        # Initialize message queue
        self.message_queue = MessageQueue()
        
        # Initialize agents
        self.assessment_agent = AssessmentAgent()
        self.documentation_agent = DocumentationAgent()
        self.analysis_agent = AnalysisAgent()
        self.report_agent = ReportAgent()
        
        # Active sessions tracking
        self.active_sessions: Dict[UUID, Dict[str, Any]] = {}
        
        # Set up message subscriptions
        self._setup_subscriptions()
    
    def _setup_subscriptions(self) -> None:
        """Set up message subscriptions for inter-agent communication"""
        # Assessment events
        self.message_queue.subscribe(
            "assessment_started",
            self._handle_assessment_started
        )
        self.message_queue.subscribe(
            "step_completed",
            self._handle_step_completed
        )
        self.message_queue.subscribe(
            "assessment_completed",
            self._handle_assessment_completed
        )
        
        # Documentation events
        self.message_queue.subscribe(
            "documentation_created",
            self._handle_documentation_created
        )
        self.message_queue.subscribe(
            "documentation_updated",
            self._handle_documentation_updated
        )
        self.message_queue.subscribe(
            "documentation_finalized",
            self._handle_documentation_finalized
        )
        
        # Analysis events
        self.message_queue.subscribe(
            "analysis_complete",
            self._handle_analysis_complete
        )
        
        # Report events
        self.message_queue.subscribe(
            "report_generated",
            self._handle_report_generated
        )
        self.message_queue.subscribe(
            "report_finalized",
            self._handle_report_finalized
        )
    
    async def start(self) -> None:
        """Start the coordinator and message processing"""
        logger.info("Starting Agent Coordinator")
        await self.message_queue.process_messages()
    
    async def _handle_assessment_started(self, message: Dict[str, Any]) -> None:
        """Handle assessment started event"""
        session_id = message["session_id"]
        logger.info(f"Assessment started: {session_id}")
        
        try:
            # Create initial documentation
            await self.documentation_agent.process_message(message)
            
            # Update session state
            self.active_sessions[session_id] = {
                "status": "in_progress",
                "current_agent": "assessment",
                "client_id": message["client_id"],
                "therapist_id": message["therapist_id"],
                "assessment_type": message["assessment_type"],
                "start_time": message["timestamp"]
            }
        except Exception as e:
            logger.error(f"Error handling assessment started: {str(e)}")
    
    async def _handle_step_completed(self, message: Dict[str, Any]) -> None:
        """Handle assessment step completion"""
        session_id = message["session_id"]
        logger.info(f"Step completed for session: {session_id}")
        
        try:
            # Update documentation with step data
            await self.documentation_agent.process_message(message)
        except Exception as e:
            logger.error(f"Error handling step completion: {str(e)}")
    
    async def _handle_assessment_completed(self, message: Dict[str, Any]) -> None:
        """Handle assessment completion"""
        session_id = message["session_id"]
        logger.info(f"Assessment completed: {session_id}")
        
        try:
            # Update session state
            if session_id in self.active_sessions:
                self.active_sessions[session_id]["status"] = "completed"
                self.active_sessions[session_id]["current_agent"] = "analysis"
            
            # Start analysis
            assessment_data = await self.assessment_agent.get_assessment_state(session_id)
            await self.analysis_agent.analyze_assessment(
                session_id=session_id,
                assessment_data=assessment_data
            )
        except Exception as e:
            logger.error(f"Error handling assessment completion: {str(e)}")
    
    async def _handle_documentation_created(self, message: Dict[str, Any]) -> None:
        """Handle new documentation creation"""
        session_id = message["session_id"]
        logger.info(f"Documentation created for session: {session_id}")
        
        if session_id in self.active_sessions:
            self.active_sessions[session_id]["documentation_id"] = message["doc_id"]
    
    async def _handle_documentation_updated(self, message: Dict[str, Any]) -> None:
        """Handle documentation updates"""
        logger.info(f"Documentation updated for session: {message['session_id']}")
    
    async def _handle_documentation_finalized(self, message: Dict[str, Any]) -> None:
        """Handle documentation finalization"""
        session_id = message["session_id"]
        logger.info(f"Documentation finalized for session: {session_id}")
        
        if session_id in self.active_sessions:
            self.active_sessions[session_id]["documentation_status"] = "finalized"
    
    async def _handle_analysis_complete(self, message: Dict[str, Any]) -> None:
        """Handle analysis completion"""
        session_id = message["session_id"]
        logger.info(f"Analysis completed for session: {session_id}")
        
        try:
            if session_id in self.active_sessions:
                self.active_sessions[session_id]["current_agent"] = "report"
            
            # Get assessment and analysis data
            assessment_data = await self.assessment_agent.get_assessment_state(session_id)
            analysis_results = await self.analysis_agent.get_analysis(session_id)
            
            # Generate report
            await self.report_agent.generate_report(
                session_id=session_id,
                report_type="initial_evaluation",  # Or determine from assessment type
                assessment_data=assessment_data,
                analysis_results=analysis_results
            )
        except Exception as e:
            logger.error(f"Error handling analysis completion: {str(e)}")
    
    async def _handle_report_generated(self, message: Dict[str, Any]) -> None:
        """Handle report generation"""
        session_id = message["session_id"]
        logger.info(f"Report generated for session: {session_id}")
        
        if session_id in self.active_sessions:
            self.active_sessions[session_id]["report_id"] = message["report_id"]
            self.active_sessions[session_id]["current_agent"] = None  # Workflow complete
    
    async def _handle_report_finalized(self, message: Dict[str, Any]) -> None:
        """Handle report finalization"""
        session_id = message["session_id"]
        logger.info(f"Report finalized for session: {session_id}")
        
        if session_id in self.active_sessions:
            self.active_sessions[session_id]["report_status"] = "finalized"
    
    async def get_session_status(self, session_id: UUID) -> Optional[Dict[str, Any]]:
        """Get current status of a session"""
        return self.active_sessions.get(session_id)