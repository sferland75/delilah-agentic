from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from .base import Base

class ReviewStatus(str, enum.Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REJECTED = "rejected"

class AssessmentReview(Base):
    __tablename__ = "assessment_reviews"

    id = Column(UUID(as_uuid=True), primary_key=True)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessments.id"))
    reviewer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    status = Column(Enum(ReviewStatus), default=ReviewStatus.PENDING)
    review_notes = Column(JSON)
    score_adjustments = Column(JSON)
    recommendations = Column(JSON)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), onupdate=datetime.utcnow)

    assessment = relationship("Assessment", back_populates="reviews")
    reviewer = relationship("User", back_populates="reviews")