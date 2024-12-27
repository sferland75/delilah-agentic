from sqlalchemy import Column, Integer, String, ForeignKey, JSON, Text, Enum
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin
import enum

class AssessmentType(enum.Enum):
    INITIAL = "initial"
    FOLLOW_UP = "follow_up"
    DISCHARGE = "discharge"

class AssessmentStatus(enum.Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Assessment(Base, TimestampMixin):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    assessment_type = Column(Enum(AssessmentType), nullable=False)
    status = Column(Enum(AssessmentStatus), nullable=False, default=AssessmentStatus.SCHEDULED)
    observations = Column(Text)
    measurements = Column(JSON, nullable=False)
    recommendations = Column(Text)
    goals = Column(JSON, nullable=False)
    
    # Foreign keys
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    therapist_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    patient = relationship("Patient", back_populates="assessments")
    therapist = relationship("User", back_populates="assessments")