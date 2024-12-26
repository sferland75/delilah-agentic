from sqlalchemy import Column, String, JSON, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from .base import Base

class AssessmentTemplate(Base):
    __tablename__ = "assessment_templates"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)  # ADL, Motor, Cognitive, etc.
    version = Column(String, nullable=False)
    schema = Column(JSON, nullable=False)  # Assessment structure and scoring rules
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    created_by_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    is_active = Column(Boolean, default=True)