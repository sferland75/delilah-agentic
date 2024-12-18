from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, List
from uuid import UUID
from enum import Enum

class AssessmentStatus(str, Enum):
    SCHEDULED = "SCHEDULED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class AssessmentData(BaseModel):
    observations: List[str]
    measurements: Dict[str, str]

class AssessmentBase(BaseModel):
    client_id: UUID
    therapist_id: UUID
    assessment_type: str
    status: AssessmentStatus
    data: AssessmentData
    scheduled_date: datetime
    completed_date: Optional[datetime] = None

class AssessmentCreate(AssessmentBase):
    pass

class AssessmentUpdate(BaseModel):
    status: Optional[AssessmentStatus] = None
    data: Optional[AssessmentData] = None
    scheduled_date: Optional[datetime] = None
    completed_date: Optional[datetime] = None

class AssessmentResponse(AssessmentBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True