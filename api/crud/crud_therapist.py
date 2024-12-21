from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database.models import Therapist
from api.crud.base import CRUDBase
from api.schemas.therapist import TherapistCreate, TherapistUpdate

class CRUDTherapist(CRUDBase[Therapist, TherapistCreate, TherapistUpdate]):
    async def get_by_email(self, db: AsyncSession, *, email: str) -> Optional[Therapist]:
        query = select(Therapist).filter(Therapist.email == email)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_license(self, db: AsyncSession, *, license_number: str, license_state: str) -> Optional[Therapist]:
        query = select(Therapist).filter(
            Therapist.license_number == license_number,
            Therapist.license_state == license_state
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_active(self, db: AsyncSession, *, skip: int = 0, limit: int = 100) -> List[Therapist]:
        query = select(Therapist).filter(Therapist.is_active == True).offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def increment_assessment_count(self, db: AsyncSession, *, therapist_id: str) -> Optional[Therapist]:
        therapist = await self.get(db, id=therapist_id)
        if therapist:
            therapist.assessment_count += 1
            await db.commit()
            await db.refresh(therapist)
        return therapist

    async def update_rating(self, db: AsyncSession, *, therapist_id: str, new_rating: float) -> Optional[Therapist]:
        therapist = await self.get(db, id=therapist_id)
        if therapist:
            therapist.rating = new_rating
            await db.commit()
            await db.refresh(therapist)
        return therapist

therapist = CRUDTherapist(Therapist)