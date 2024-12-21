from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_
from database.models import Assessment
from api.crud.base import CRUDBase
from api.schemas.assessment import AssessmentCreate, AssessmentUpdate
from uuid import UUID

class CRUDAssessment(CRUDBase[Assessment, AssessmentCreate, AssessmentUpdate]):
    async def get_by_client(self, db: AsyncSession, *, client_id: UUID) -> List[Assessment]:
        query = select(Assessment).filter(Assessment.client_id == client_id)
        result = await db.execute(query)
        return result.scalars().all()

    async def get_by_therapist(self, db: AsyncSession, *, therapist_id: UUID) -> List[Assessment]:
        query = select(Assessment).filter(Assessment.therapist_id == therapist_id)
        result = await db.execute(query)
        return result.scalars().all()

    async def get_by_status(self, db: AsyncSession, *, status: str) -> List[Assessment]:
        query = select(Assessment).filter(Assessment.status == status)
        result = await db.execute(query)
        return result.scalars().all()

    async def get_by_date_range(
        self, 
        db: AsyncSession, 
        *, 
        start_date: datetime, 
        end_date: datetime
    ) -> List[Assessment]:
        query = select(Assessment).filter(
            and_(
                Assessment.scheduled_date >= start_date,
                Assessment.scheduled_date <= end_date
            )
        )
        result = await db.execute(query)
        return result.scalars().all()

assessment = CRUDAssessment(Assessment)