from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from datetime import datetime
from uuid import UUID

from agents.assessment.models import AssessmentStatus, AssessmentType

class AssessmentCreate(BaseModel):
    patient_id: str
    protocol_id: str
    assessment_type: AssessmentType
    metadata: Optional[Dict[str, Any]] = None

class AssessmentStepData(BaseModel):
    data: Dict[str, Any]

class AssessmentResponse(BaseModel):
    id: UUID
    patient_id: str
    protocol_id: str
    type: AssessmentType
    status: AssessmentStatus
    current_step: Optional[str] = None
    completed_steps: List[str]
    data: Dict[str, Any]
    started_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None
    metadata: Dict[str, Any]

    class Config:
        from_attributes = True