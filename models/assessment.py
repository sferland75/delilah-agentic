from sqlalchemy import Column, Integer, String, ForeignKey, JSON, Enum as SQLEnum, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum
from .base import Base, TimestampMixin

class AssessmentStatus(str, Enum):
    IN_PROGRESS = 'in_progress'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'

class AssessmentType(str, Enum):
    ADL = 'Activities of Daily Living'
    IADL = 'Instrumental Activities of Daily Living'
    COGNITIVE = 'Cognitive Assessment'
    PHYSICAL = 'Physical Assessment'
    SENSORY = 'Sensory Assessment'

class Assessment(Base, TimestampMixin):
    __tablename__ = 'assessments'
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    client_id = Column(UUID(as_uuid=True), ForeignKey('clients.id'), nullable=False)
    therapist_id = Column(UUID(as_uuid=True), ForeignKey('therapists.id'), nullable=False)
    type = Column(SQLEnum(AssessmentType), nullable=False)
    status = Column(SQLEnum(AssessmentStatus), nullable=False, default=AssessmentStatus.IN_PROGRESS)
    current_step = Column(Integer, default=0)
    steps_data = Column(JSON, default={})
    
    # Relationships
    client = relationship('Client', back_populates='assessments')
    therapist = relationship('Therapist', back_populates='assessments')
    messages = relationship('AssessmentMessage', back_populates='assessment', cascade='all, delete-orphan')

class AssessmentMessage(Base, TimestampMixin):
    __tablename__ = 'assessment_messages'
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey('assessments.id'), nullable=False)
    type = Column(String, nullable=False)
    payload = Column(JSON, nullable=False)
    
    # Relationships
    assessment = relationship('Assessment', back_populates='messages')
