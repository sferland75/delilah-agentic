from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Optional, Dict, List

class PatientBase(BaseModel):
    name: str
    date_of_birth: datetime
    gender: str
    medical_history: Dict = {}

class PatientCreate(PatientBase):
    pass

class PatientUpdate(PatientBase):
    name: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    medical_history: Optional[Dict] = None

class AssessmentBrief(BaseModel):
    id: UUID4
    assessment_type: str
    status: str
    created_at: datetime
    created_by: Dict[str, str]

    class Config:
        from_attributes = True

class PatientResponse(PatientBase):
    id: UUID4
    created_at: datetime
    assessments: List[AssessmentBrief] = []

    class Config:
        from_attributes = True