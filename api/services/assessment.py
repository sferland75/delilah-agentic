from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID

from database.models import Assessment
from api.models.assessment import AssessmentCreate, AssessmentStatus, AssessmentType
from agents.assessment_agent import AssessmentAgent

class AssessmentService:
    def __init__(self, db: Session):
        self.db = db
        self.agent = AssessmentAgent()

    async def create_assessment(self, assessment: AssessmentCreate) -> Assessment:
        try:
            # Start assessment with agent
            session_id = await self.agent.start_assessment(
                client_id=assessment.client_id,
                therapist_id=assessment.therapist_id,
                assessment_type=assessment.assessment_type
            )

            # Create database record
            db_assessment = Assessment(
                id=session_id,
                client_id=assessment.client_id,
                therapist_id=assessment.therapist_id,
                assessment_type=assessment.assessment_type,
                status=AssessmentStatus.CREATED,
                data={},
                scheduled_date=datetime.utcnow(),
                notes=assessment.notes
            )
            self.db.add(db_assessment)
            await self.db.commit()
            await self.db.refresh(db_assessment)
            return db_assessment
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise e

    async def get_assessment(self, assessment_id: UUID) -> Optional[Assessment]:
        try:
            assessment = await self.db.query(Assessment).filter(Assessment.id == assessment_id).first()
            if assessment:
                # Get agent state
                agent_state = await self.agent.get_assessment_state(assessment_id)
                assessment.data.update({"agent_state": agent_state})
            return assessment
        except SQLAlchemyError as e:
            raise e

    async def get_next_step(self, assessment_id: UUID) -> Dict[str, Any]:
        """Get next assessment step from agent"""
        try:
            return await self.agent.get_next_step(assessment_id)
        except ValueError as e:
            raise e

    async def submit_step_data(
        self,
        assessment_id: UUID,
        step_number: int,
        data: Dict[str, Any]
    ) -> Assessment:
        """Submit step data and update assessment"""
        try:
            # Submit to agent
            await self.agent.submit_step_data(assessment_id, step_number, data)
            
            # Update database
            assessment = await self.get_assessment(assessment_id)
            if not assessment:
                raise ValueError("Assessment not found")
                
            agent_state = await self.agent.get_assessment_state(assessment_id)
            assessment.status = agent_state["status"]
            assessment.data = {
                **assessment.data,
                f"step_{step_number}": data,
                "agent_state": agent_state
            }
            assessment.updated_at = datetime.utcnow()
            
            await self.db.commit()
            await self.db.refresh(assessment)
            return assessment
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise e