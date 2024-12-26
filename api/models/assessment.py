from pydantic import BaseModel, UUID4, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class AssessmentType(str, Enum):
    INITIAL = "initial_evaluation"
    PROGRESS = "progress_note"
    DISCHARGE = "discharge"
    FOLLOW_UP = "follow_up"

class AssessmentStatus(str, Enum):
    CREATED = "created"
    IN_PROGRESS = "in_progress"
    PENDING_REVIEW = "pending_review"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class DocumentationType(str, Enum):
    ASSESSMENT_NOTE = "assessment_note"
    PROGRESS_NOTE = "progress_note"
    TREATMENT_PLAN = "treatment_plan"
    DISCHARGE_SUMMARY = "discharge_summary"
    EVALUATION_REPORT = "evaluation_report"
    CONSULTATION_NOTE = "consultation_note"

class AssessmentCreate(BaseModel):
    client_id: UUID4
    therapist_id: UUID4
    assessment_type: AssessmentType
    notes: Optional[str] = None

class AssessmentResponse(BaseModel):
    id: UUID4
    client_id: UUID4
    therapist_id: UUID4
    assessment_type: AssessmentType
    status: AssessmentStatus
    data: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime
    updated_at: Optional[datetime] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True