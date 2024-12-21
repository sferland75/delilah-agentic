from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class AssessmentBase(BaseModel):
    assessment_type: str
    status: str
    scheduled_date: Optional[datetime] = None
    completion_date: Optional[datetime] = None
    notes: Optional[str] = None

class AssessmentCreate(AssessmentBase):
    client_id: UUID
    therapist_id: UUID

class AssessmentUpdate(AssessmentBase):
    pass

class AssessmentInDBBase(AssessmentBase):
    id: UUID
    client_id: UUID
    therapist_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Assessment(AssessmentInDBBase):
    pass

class AssessmentInDB(AssessmentInDBBase):
    pass