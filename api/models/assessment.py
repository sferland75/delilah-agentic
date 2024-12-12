from enum import Enum
from typing import Optional, List, Dict
from uuid import UUID
from pydantic import BaseModel
from .base import TimestampedModel

class AssessmentType(str, Enum):
    ADL = "Activities of Daily Living"
    IADL = "Instrumental Activities of Daily Living"
    COGNITIVE = "Cognitive Assessment"
    PHYSICAL = "Physical Assessment"
    SENSORY = "Sensory Assessment"

class AssessmentCreate(BaseModel):
    client_id: UUID
    therapist_id: UUID
    assessment_type: AssessmentType

class AssessmentStatus(BaseModel):
    session_id: UUID
    status: str
    current_step: Optional[Dict]
    analysis_status: Optional[str]
    report_status: Optional[str]