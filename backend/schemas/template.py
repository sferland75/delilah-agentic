from pydantic import BaseModel, Field
from typing import List, Optional, Union, Dict
from datetime import datetime
from enum import Enum

class TemplateStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    ARCHIVED = "archived"

class ScoringMethod(str, Enum):
    SUM = "sum"
    AVERAGE = "average"
    CUSTOM = "custom"

class ValidationRule(BaseModel):
    type: str
    value: Optional[Union[int, str]] = None
    message: str

class FieldScoring(BaseModel):
    weight: Optional[float] = None
    score_map: Optional[Dict[str, float]] = None

class AssessmentField(BaseModel):
    id: str
    label: str
    type: str
    required: bool
    options: Optional[List[str]] = None
    default_value: Optional[Union[str, int, float, bool]] = None
    description: Optional[str] = None
    validation: Optional[List[ValidationRule]] = None
    scoring: Optional[FieldScoring] = None

class AssessmentSection(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    fields: List[AssessmentField]
    order: int

class ScoringRange(BaseModel):
    min: float
    max: float
    label: str
    description: Optional[str] = None

class TemplateScoring(BaseModel):
    method: ScoringMethod
    ranges: Optional[List[ScoringRange]] = None
    custom_logic: Optional[str] = None

class TemplateBase(BaseModel):
    name: str
    description: str
    version: str
    status: TemplateStatus
    sections: List[AssessmentSection]
    scoring: TemplateScoring
    category_id: Optional[str] = None

class TemplateCreate(TemplateBase):
    pass

class TemplateUpdate(TemplateBase):
    pass

class Template(TemplateBase):
    id: str
    created_at: datetime
    updated_at: datetime
    created_by: str

    class Config:
        from_attributes = True