from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, JSON, Boolean, DateTime, ForeignKey, Text, Enum as SQLEnum
from datetime import datetime, timezone
from typing import Optional, List
import uuid
import enum
from api.models.state import AgentStateManager, AgentState

def utc_now_no_tz() -> datetime:
    """Returns current UTC time without timezone info"""
    return datetime.now(timezone.utc).replace(tzinfo=None)

class Base(DeclarativeBase):
    pass

class AssessmentStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class DocumentationType(str, enum.Enum):
    ASSESSMENT_NOTE = "assessment_note"
    PROGRESS_NOTE = "progress_note"
    TREATMENT_PLAN = "treatment_plan"
    DISCHARGE_SUMMARY = "discharge_summary"

class Agent(Base):
    __tablename__ = "agents"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(50))
    type: Mapped[str] = mapped_column(String(50))
    state_manager: Mapped[dict] = mapped_column(JSON, default=lambda: AgentStateManager().model_dump())
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=utc_now_no_tz
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        nullable=True, 
        onupdate=utc_now_no_tz
    )

    def transition_state(self, new_state: AgentState, reason: Optional[str] = None) -> bool:
        state_manager = AgentStateManager.model_validate(self.state_manager)
        success = state_manager.transition_to(new_state, reason)
        if success:
            self.state_manager = state_manager.model_dump()
        return success

class Client(Base):
    __tablename__ = "clients"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    first_name: Mapped[str] = mapped_column(String(50))
    last_name: Mapped[str] = mapped_column(String(50))
    date_of_birth: Mapped[datetime] = mapped_column(DateTime)
    contact_info: Mapped[dict] = mapped_column(JSON)
    medical_history: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now_no_tz)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=True,
        onupdate=utc_now_no_tz
    )

    # Relationships
    assessments: Mapped[List["Assessment"]] = relationship("Assessment", back_populates="client")
    documents: Mapped[List["Documentation"]] = relationship("Documentation", back_populates="client")

class Therapist(Base):
    __tablename__ = "therapists"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    first_name: Mapped[str] = mapped_column(String(50))
    last_name: Mapped[str] = mapped_column(String(50))
    credentials: Mapped[dict] = mapped_column(JSON)
    specialties: Mapped[List[str]] = mapped_column(JSON)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now_no_tz)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=True,
        onupdate=utc_now_no_tz
    )

    # Relationships
    assessments: Mapped[List["Assessment"]] = relationship("Assessment", back_populates="therapist")
    documents: Mapped[List["Documentation"]] = relationship("Documentation", back_populates="therapist")

class Assessment(Base):
    __tablename__ = "assessments"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    client_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("clients.id"))
    therapist_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("therapists.id"))
    assessment_type: Mapped[str] = mapped_column(String(100))
    status: Mapped[AssessmentStatus] = mapped_column(SQLEnum(AssessmentStatus))
    data: Mapped[dict] = mapped_column(JSON, default=dict)
    scheduled_date: Mapped[datetime] = mapped_column(DateTime)
    completed_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now_no_tz)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=True,
        onupdate=utc_now_no_tz
    )

    # Relationships
    client: Mapped["Client"] = relationship("Client", back_populates="assessments")
    therapist: Mapped["Therapist"] = relationship("Therapist", back_populates="assessments")
    documents: Mapped[List["Documentation"]] = relationship("Documentation", back_populates="assessment")
    report: Mapped[Optional["Report"]] = relationship("Report", back_populates="assessment", uselist=False)

class Documentation(Base):
    __tablename__ = "documentation"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    client_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("clients.id"))
    therapist_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("therapists.id"))
    assessment_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("assessments.id"), nullable=True)
    doc_type: Mapped[DocumentationType] = mapped_column(SQLEnum(DocumentationType))
    content: Mapped[str] = mapped_column(Text)
    meta_info: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now_no_tz)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=True,
        onupdate=utc_now_no_tz
    )

    # Relationships
    client: Mapped["Client"] = relationship("Client", back_populates="documents")
    therapist: Mapped["Therapist"] = relationship("Therapist", back_populates="documents")
    assessment: Mapped[Optional["Assessment"]] = relationship("Assessment", back_populates="documents")

class Report(Base):
    __tablename__ = "reports"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    assessment_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("assessments.id"))
    content: Mapped[dict] = mapped_column(JSON)
    summary: Mapped[str] = mapped_column(Text)
    recommendations: Mapped[List[str]] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now_no_tz)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=True,
        onupdate=utc_now_no_tz
    )

    # Relationships
    assessment: Mapped["Assessment"] = relationship("Assessment", back_populates="report")