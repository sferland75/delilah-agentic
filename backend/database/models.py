from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    role = Column(String)  # 'admin', 'therapist', 'reviewer'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    assessments = relationship("Assessment", back_populates="therapist")
    reviews = relationship("Assessment", back_populates="reviewer")

class Patient(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True)
    name = Column(String)
    date_of_birth = Column(DateTime)
    gender = Column(String)
    contact_info = Column(JSON)
    medical_history = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    assessments = relationship("Assessment", back_populates="patient")

class AssessmentTemplate(Base):
    __tablename__ = "assessment_templates"

    id = Column(String, primary_key=True)
    name = Column(String)
    description = Column(String)
    version = Column(String)
    sections = Column(JSON)  # Store sections as JSON
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    status = Column(String, default="draft")  # draft, active, archived
    category_id = Column(String, nullable=True)
    scoring = Column(JSON, nullable=True)  # Store scoring rules as JSON

    assessments = relationship("Assessment", back_populates="template")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(String, primary_key=True)
    template_id = Column(String, ForeignKey("assessment_templates.id"))
    patient_id = Column(String, ForeignKey("patients.id"))
    therapist_id = Column(String, ForeignKey("users.id"))
    reviewer_id = Column(String, ForeignKey("users.id"), nullable=True)
    status = Column(String)  # draft, in_progress, completed, reviewed
    data = Column(JSON)  # Store assessment responses as JSON
    score = Column(Integer, nullable=True)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)

    template = relationship("AssessmentTemplate", back_populates="assessments")
    patient = relationship("Patient", back_populates="assessments")
    therapist = relationship("User", foreign_keys=[therapist_id], back_populates="assessments")
    reviewer = relationship("User", foreign_keys=[reviewer_id], back_populates="reviews")
    changes = relationship("AssessmentChange", back_populates="assessment")

class AssessmentChange(Base):
    __tablename__ = "assessment_changes"

    id = Column(String, primary_key=True)
    assessment_id = Column(String, ForeignKey("assessments.id"))
    user_id = Column(String, ForeignKey("users.id"))
    action = Column(String)  # create, update, submit, review
    changes = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    meta_info = Column(JSON, nullable=True)  # Changed from metadata to meta_info

    assessment = relationship("Assessment", back_populates="changes")