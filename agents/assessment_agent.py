import asyncio
from typing import Dict, Optional, Any
from uuid import UUID
from datetime import datetime
from api.models.assessment import AssessmentType, AssessmentStatus
import logging

logger = logging.getLogger(__name__)

class AssessmentAgent:
    def __init__(self):
        self.message_queue: asyncio.Queue = asyncio.Queue()
        self.active_assessments: Dict[UUID, Dict[str, Any]] = {}

    async def start_assessment(
        self,
        client_id: UUID,
        therapist_id: UUID,
        assessment_type: AssessmentType
    ) -> UUID:
        """Initialize a new assessment session"""
        try:
            session_id = UUID(int=len(self.active_assessments) + 1)
            
            assessment_state = {
                "client_id": client_id,
                "therapist_id": therapist_id,
                "type": assessment_type,
                "status": AssessmentStatus.CREATED,
                "current_step": 0,
                "steps_completed": [],
                "data": {},
                "start_time": datetime.utcnow(),
                "last_update": datetime.utcnow()
            }
            
            self.active_assessments[session_id] = assessment_state
            
            # Notify that assessment has started
            await self.message_queue.put({
                "type": "assessment_started",
                "session_id": session_id,
                "assessment_type": assessment_type,
                "client_id": client_id,
                "therapist_id": therapist_id,
                "timestamp": datetime.utcnow()
            })
            
            return session_id
        except Exception as e:
            logger.error(f"Error starting assessment: {str(e)}")
            raise

    async def get_next_step(self, session_id: UUID) -> Optional[Dict[str, Any]]:
        """Get the next assessment step based on current state"""
        if session_id not in self.active_assessments:
            raise ValueError("Invalid session ID")
        
        assessment = self.active_assessments[session_id]
        current_step = assessment["current_step"]
        
        # Get steps based on assessment type
        steps = self._get_assessment_steps(assessment["type"])
        
        if current_step >= len(steps):
            return None
            
        return {
            "step": current_step + 1,
            "total_steps": len(steps),
            "type": steps[current_step]["type"],
            "instructions": steps[current_step]["instructions"],
            "required_fields": steps[current_step]["required_fields"]
        }

    async def submit_step_data(
        self,
        session_id: UUID,
        step_number: int,
        data: Dict[str, Any]
    ) -> bool:
        """Submit data for a specific assessment step"""
        if session_id not in self.active_assessments:
            raise ValueError("Invalid session ID")
            
        assessment = self.active_assessments[session_id]
        
        if step_number != assessment["current_step"] + 1:
            raise ValueError("Invalid step number")
            
        # Validate required fields
        steps = self._get_assessment_steps(assessment["type"])
        required_fields = steps[assessment["current_step"]]["required_fields"]
        
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")
            
        # Update assessment state
        assessment["data"][f"step_{step_number}"] = data
        assessment["steps_completed"].append(step_number)
        assessment["current_step"] += 1
        assessment["last_update"] = datetime.utcnow()
        
        # Check if assessment is complete
        if assessment["current_step"] >= len(steps):
            assessment["status"] = AssessmentStatus.COMPLETED
            await self.message_queue.put({
                "type": "assessment_completed",
                "session_id": session_id,
                "timestamp": datetime.utcnow()
            })
        else:
            await self.message_queue.put({
                "type": "step_completed",
                "session_id": session_id,
                "step_number": step_number,
                "timestamp": datetime.utcnow()
            })
        
        return True

    def _get_assessment_steps(self, assessment_type: AssessmentType) -> list:
        """Get the steps for a specific assessment type"""
        if assessment_type == AssessmentType.INITIAL:
            return [
                {
                    "type": "demographics",
                    "instructions": "Collect client demographic information",
                    "required_fields": ["name", "date_of_birth", "contact_info"]
                },
                {
                    "type": "medical_history",
                    "instructions": "Document relevant medical history",
                    "required_fields": ["conditions", "medications", "allergies"]
                },
                {
                    "type": "functional_status",
                    "instructions": "Assess current functional status",
                    "required_fields": ["adl_status", "mobility_status", "cognitive_status"]
                },
                {
                    "type": "goals",
                    "instructions": "Establish treatment goals",
                    "required_fields": ["short_term_goals", "long_term_goals"]
                }
            ]
        # Add steps for other assessment types as needed
        return []

    async def get_assessment_state(self, session_id: UUID) -> Dict[str, Any]:
        """Get current state of an assessment"""
        if session_id not in self.active_assessments:
            raise ValueError("Invalid session ID")
        return self.active_assessments[session_id]