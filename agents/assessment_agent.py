from dataclasses import dataclass
from typing import Dict, List, Optional
import asyncio
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession
from models.assessment import AssessmentType, AssessmentStatus
from repositories.assessment import AssessmentRepository

@dataclass
class AssessmentStep:
    id: str
    question: str
    input_type: str  # 'scale', 'text', 'multiselect', 'number'
    options: Optional[List[str]] = None
    validation: Optional[Dict] = None
    required: bool = True

class AssessmentProtocol:
    def __init__(self, assessment_type: AssessmentType):
        self.type = assessment_type
        self.steps = self._load_protocol()
    
    def _load_protocol(self) -> List[AssessmentStep]:
        if self.type == AssessmentType.ADL:
            return [
                AssessmentStep(
                    id="bathing",
                    question="Rate client's bathing independence",
                    input_type="scale",
                    options=["Independent", "Supervision", "Minimal Assist", "Moderate Assist", "Maximum Assist"],
                    validation={"required": True}
                ),
                AssessmentStep(
                    id="bathing_notes",
                    question="Specific observations during bathing assessment",
                    input_type="text",
                    validation={"min_length": 10}
                )
            ]
        return []

class AssessmentAgent:
    def __init__(self, session: AsyncSession):
        self.message_queue = asyncio.Queue()
        self.repo = AssessmentRepository(session)
    
    async def start_assessment(self, client_id: UUID, therapist_id: UUID, assessment_type: AssessmentType) -> UUID:
        # Create assessment in database
        assessment = await self.repo.create_assessment(
            client_id=client_id,
            therapist_id=therapist_id,
            assessment_type=assessment_type
        )
        
        # Create started message
        await self.repo.create_message(
            assessment_id=assessment.id,
            message_type='assessment_started',
            payload={
                'client_id': str(client_id),
                'assessment_type': assessment_type.value
            }
        )
        
        # Notify coordinator
        await self.message_queue.put({
            'type': 'assessment_started',
            'session_id': assessment.id,
            'client_id': client_id,
            'assessment_type': assessment_type.value
        })
        
        return assessment.id

    async def get_next_step(self, session_id: UUID) -> Optional[AssessmentStep]:
        assessment = await self.repo.get_assessment(session_id)
        if not assessment:
            return None
        
        protocol = AssessmentProtocol(assessment.type)
        if assessment.current_step >= len(protocol.steps):
            return None
        
        return protocol.steps[assessment.current_step]

    async def submit_step(self, session_id: UUID, step_data: dict) -> bool:
        assessment = await self.repo.get_assessment(session_id)
        if not assessment:
            raise ValueError("Assessment not found")
        
        # Update assessment with step data
        assessment = await self.repo.update_assessment_step(
            assessment_id=session_id,
            step_data=step_data
        )
        
        # Create step completion message
        await self.repo.create_message(
            assessment_id=session_id,
            message_type='step_completed',
            payload=step_data
        )
        
        # Notify coordinator
        await self.message_queue.put({
            'type': 'step_completed',
            'session_id': session_id,
            'step_data': step_data
        })
        
        # Check if assessment is complete
        protocol = AssessmentProtocol(assessment.type)
        if assessment.current_step >= len(protocol.steps):
            await self.complete_assessment(session_id)
            return True
            
        return False

    async def complete_assessment(self, session_id: UUID):
        assessment = await self.repo.complete_assessment(session_id)
        
        # Create completion message
        await self.repo.create_message(
            assessment_id=session_id,
            message_type='assessment_completed',
            payload={
                'total_steps': assessment.current_step
            }
        )
        
        # Notify coordinator
        await self.message_queue.put({
            'type': 'assessment_completed',
            'session_id': session_id,
            'client_id': assessment.client_id,
            'therapist_id': assessment.therapist_id
        })