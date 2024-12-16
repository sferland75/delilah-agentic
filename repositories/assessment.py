from typing import Optional, List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models import Assessment, AssessmentMessage
from models.assessment import AssessmentType, AssessmentStatus
from .base import BaseRepository

class AssessmentRepository(BaseRepository):
    def __init__(self, session: AsyncSession):
        super().__init__(session)

    async def create_assessment(self, 
                              client_id: UUID, 
                              therapist_id: UUID, 
                              assessment_type: AssessmentType) -> Assessment:
        assessment = Assessment(
            client_id=client_id,
            therapist_id=therapist_id,
            type=assessment_type,
            status=AssessmentStatus.IN_PROGRESS
        )
        return await self.create(assessment)

    async def get_assessment(self, assessment_id: UUID) -> Optional[Assessment]:
        return await self.get(Assessment, assessment_id)

    async def list_client_assessments(self, client_id: UUID) -> List[Assessment]:
        result = await self.session.execute(
            select(Assessment).where(Assessment.client_id == client_id)
        )
        return result.scalars().all()

    async def update_assessment_step(self, 
                                   assessment_id: UUID, 
                                   step_data: dict) -> Assessment:
        assessment = await self.get_assessment(assessment_id)
        if not assessment:
            raise ValueError("Assessment not found")

        assessment.current_step += 1
        if not assessment.steps_data:
            assessment.steps_data = {}
        assessment.steps_data[str(assessment.current_step)] = step_data

        return await self.update(assessment)

    async def complete_assessment(self, assessment_id: UUID) -> Assessment:
        assessment = await self.get_assessment(assessment_id)
        if not assessment:
            raise ValueError("Assessment not found")

        assessment.status = AssessmentStatus.COMPLETED
        return await self.update(assessment)

    async def create_message(self, 
                           assessment_id: UUID, 
                           message_type: str, 
                           payload: dict) -> AssessmentMessage:
        message = AssessmentMessage(
            assessment_id=assessment_id,
            type=message_type,
            payload=payload
        )
        return await self.create(message)

    async def get_assessment_messages(self, 
                                    assessment_id: UUID) -> List[AssessmentMessage]:
        result = await self.session.execute(
            select(AssessmentMessage)
            .where(AssessmentMessage.assessment_id == assessment_id)
            .order_by(AssessmentMessage.created_at)
        )
        return result.scalars().all()
