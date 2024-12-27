from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class AssessmentType(str, Enum):
    INITIAL = "initial"
    FOLLOW_UP = "follow_up"
    DISCHARGE = "discharge"

class AssessmentStatus(str, Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class AssessmentBase(BaseModel):
    assessment_type: AssessmentType
    observations: Optional[str] = None
    measurements: Dict[str, Any]
    recommendations: Optional[str] = None
    goals: Dict[str, Any]

class AssessmentCreate(AssessmentBase):
    patient_id: int

class AssessmentUpdate(AssessmentBase):
    status: Optional[AssessmentStatus] = None
    observations: Optional[str] = None
    recommendations: Optional[str] = None

class Assessment(AssessmentBase):
    id: int
    patient_id: int
    therapist_id: int
    status: AssessmentStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True