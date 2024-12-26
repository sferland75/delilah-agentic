from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Integer, JSON, Table
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from .base import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    roles = Column(JSON, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    assessments = relationship("Assessment", back_populates="created_by")
    reviews = relationship("Assessment", back_populates="reviewed_by")

class Assessment(Base):
    __tablename__ = "assessments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey('patients.id'))
    created_by_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    reviewed_by_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=True)
    assessment_type = Column(String, nullable=False)
    status = Column(String, nullable=False)
    data = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), onupdate=datetime.utcnow)
    
    patient = relationship("Patient", back_populates="assessments")
    created_by = relationship("User", foreign_keys=[created_by_id], back_populates="assessments")
    reviewed_by = relationship("User", foreign_keys=[reviewed_by_id], back_populates="reviews")

class Patient(Base):
    __tablename__ = "patients"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    date_of_birth = Column(DateTime, nullable=False)
    gender = Column(String)
    medical_history = Column(JSON)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    assessments = relationship("Assessment", back_populates="patient")