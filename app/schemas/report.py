from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, List
from uuid import UUID

class RecommendationItem(BaseModel):
    category: str
    description: str
    priority: Optional[str] = "medium"

class ReportContent(BaseModel):
    findings: List[Dict[str, str]]
    analysis: str
    outcome_measures: Optional[Dict[str, str]] = None

class ReportBase(BaseModel):
    assessment_id: UUID
    content: ReportContent
    summary: str
    recommendations: List[RecommendationItem]

class ReportCreate(ReportBase):
    pass

class ReportUpdate(BaseModel):
    content: Optional[ReportContent] = None
    summary: Optional[str] = None
    recommendations: Optional[List[RecommendationItem]] = None

class ReportResponse(ReportBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True