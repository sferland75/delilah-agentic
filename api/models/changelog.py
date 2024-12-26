from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

class ChangeType(str, enum.Enum):
    CREATE = "create"
    UPDATE = "update"
    REVIEW = "review"
    STATUS_CHANGE = "status_change"

class AssessmentChangelog(Base):
    __tablename__ = "assessment_changelog"

    id = Column(UUID(as_uuid=True), primary_key=True)
    assessment_id = Column(UUID(as_uuid=True), ForeignKey("assessments.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    change_type = Column(Enum(ChangeType))
    previous_state = Column(JSON, nullable=True)
    new_state = Column(JSON)
    metadata = Column(JSON, nullable=True)
    timestamp = Column(DateTime(timezone=True), default=datetime.utcnow)

    assessment = relationship("Assessment", back_populates="changes")
    user = relationship("User", back_populates="changes")