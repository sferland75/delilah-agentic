from typing import Optional, List
from uuid import UUID
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession

from .base import BaseRepository
from database.models import Assessment, Report
from api.models.assessment import AssessmentCreate, AssessmentUpdate

class AssessmentRepository(BaseRepository[Assessment]):
    def __init__(self, session: AsyncSession):
        super().__init__(Assessment, session)

    async def create_assessment(
        self,
        client_id: UUID,
        therapist_id: UUID,
        assessment_type: str
    ) -> Assessment:
        """Create a new assessment session"""
        db_obj = Assessment(
            client_id=client_id,
            therapist_id=therapist_id,
            type=assessment_type,
            status="in_progress",
            data={}
        )
        self.session.add(db_obj)
        await self.session.flush()
        return db_obj

    async def get_client_assessments(
        self,
        client_id: UUID,
        skip: int = 0,
        limit: int = 100
    ) -> List[Assessment]:
        """Get all assessments for a client"""
        query = select(Assessment).where(
            Assessment.client_id == client_id
        ).offset(skip).limit(limit)
        
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_therapist_assessments(
        self,
        therapist_id: UUID,
        skip: int = 0,
        limit: int = 100
    ) -> List[Assessment]:
        """Get all assessments by a therapist"""
        query = select(Assessment).where(
            Assessment.therapist_id == therapist_id
        ).offset(skip).limit(limit)
        
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def update_assessment_data(
        self,
        assessment_id: UUID,
        data: dict
    ) -> Optional[Assessment]:
        """Update assessment data"""
        assessment = await self.get(assessment_id)
        if not assessment:
            return None
            
        assessment.data.update(data)
        await self.session.flush()
        return assessment

    async def update_status(
        self,
        assessment_id: UUID,
        status: str
    ) -> Optional[Assessment]:
        """Update assessment status"""
        assessment = await self.get(assessment_id)
        if not assessment:
            return None
            
        assessment.status = status
        await self.session.flush()
        return assessment

    async def get_with_report(
        self,
        assessment_id: UUID
    ) -> Optional[Assessment]:
        """Get assessment with its associated report"""
        query = select(Assessment).where(
            Assessment.id == assessment_id
        ).join(Report)
        
        result = await self.session.execute(query)
        return result.scalars().first()