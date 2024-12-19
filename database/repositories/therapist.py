from typing import Optional, List
from sqlalchemy import select, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession

from .base import BaseRepository
from database.models import Therapist, User
from api.models.therapist import TherapistCreate, TherapistUpdate

class TherapistRepository(BaseRepository[Therapist]):
    def __init__(self, session: AsyncSession):
        super().__init__(Therapist, session)

    async def get_by_user_id(self, user_id: UUID) -> Optional[Therapist]:
        """Get therapist by user ID"""
        query = select(Therapist).where(Therapist.user_id == user_id)
        result = await self.session.execute(query)
        return result.scalars().first()

    async def create_therapist(self, therapist_in: TherapistCreate, user: User) -> Therapist:
        """Create a new therapist profile"""
        db_obj = Therapist(
            user_id=user.id,
            **therapist_in.model_dump(exclude={"specializations"})
        )
        # Handle specializations separately since it's a JSON field
        db_obj.specializations = [s.model_dump() for s in therapist_in.specializations]
        
        self.session.add(db_obj)
        await self.session.flush()
        return db_obj

    async def update_therapist(self, therapist: Therapist, therapist_in: TherapistUpdate) -> Therapist:
        """Update therapist information"""
        update_data = therapist_in.model_dump(exclude_unset=True)
        
        if "specializations" in update_data:
            # Handle specializations update
            therapist.specializations = [s.model_dump() for s in update_data.pop("specializations")]
        
        for field, value in update_data.items():
            setattr(therapist, field, value)

        await self.session.flush()
        return therapist

    async def search_therapists(
        self,
        specialization: Optional[str] = None,
        state: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Therapist]:
        """Search therapists with filters"""
        conditions = [Therapist.is_active == True]
        
        if state:
            conditions.append(Therapist.license_state == state)
            
        if specialization:
            # Note: This assumes specializations is a JSON array of objects with 'name' field
            conditions.append(
                Therapist.specializations.op('?')({"name": specialization})
            )
        
        query = select(Therapist).where(
            and_(*conditions)
        ).offset(skip).limit(limit)
        
        result = await self.session.execute(query)
        return list(result.scalars().all())

    async def get_stats(self, therapist_id: UUID) -> dict:
        """Get therapist statistics"""
        therapist = await self.get(therapist_id)
        if not therapist:
            return None
            
        return {
            "total_assessments": therapist.assessment_count,
            "rating": therapist.rating,
            "specializations": [s["name"] for s in therapist.specializations],
            "years_of_experience": therapist.years_of_experience
        }

    async def increment_assessment_count(self, therapist_id: UUID) -> None:
        """Increment the assessment count for a therapist"""
        therapist = await self.get(therapist_id)
        if therapist:
            therapist.assessment_count += 1
            await self.session.flush()