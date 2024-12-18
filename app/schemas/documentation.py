from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, List
from uuid import UUID
from enum import Enum

class DocumentationType(str, Enum):
    ASSESSMENT_NOTE = "ASSESSMENT_NOTE"
    PROGRESS_NOTE = "PROGRESS_NOTE"
    TREATMENT_PLAN = "TREATMENT_PLAN"
    DISCHARGE_SUMMARY = "DISCHARGE_SUMMARY"

class MetaInfo(BaseModel):
    version: str
    template_used: str
    last_modified_by: str
    tags: List[str]

class DocumentationBase(BaseModel):
    client_id: UUID
    therapist_id: UUID
    assessment_id: Optional[UUID] = None
    doc_type: DocumentationType
    content: str
    meta_info: MetaInfo

class DocumentationCreate(DocumentationBase):
    pass

class DocumentationUpdate(BaseModel):
    doc_type: Optional[DocumentationType] = None
    content: Optional[str] = None
    meta_info: Optional[MetaInfo] = None

class DocumentationResponse(DocumentationBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True