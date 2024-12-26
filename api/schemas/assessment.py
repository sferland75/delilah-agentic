from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Optional, Dict, Any

class AssessmentBase(BaseModel):
    assessment_type: str
    patient_id: UUID4
    data: Dict[str, Any]

class AssessmentCreate(AssessmentBase):
    pass

class AssessmentUpdate(BaseModel):
    assessment_type: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    status: Optional[str] = None

class AssessmentResponse(AssessmentBase):
    id: UUID4
    status: str
    created_at: datetime
    updated_at: datetime
    created_by_id: UUID4
    reviewed_by_id: Optional[UUID4] = None
    
    class Config:
        from_attributes = True