from typing import List
from datetime import datetime
from uuid import UUID, uuid4
from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Integer, Float, JSON, Enum
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID as PUUID

from .database import Base
from api.models.user import UserRole

class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(PUUID(as_uuid=True), primary_key=True, default=uuid4)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    first_name: Mapped[str] = mapped_column(String)
    last_name: Mapped[str] = mapped_column(String)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    therapist: Mapped['Therapist'] = relationship("Therapist", back_populates="user", uselist=False)

class Client(Base):
    __tablename__ = "clients"

    id: Mapped[UUID] = mapped_column(PUUID(as_uuid=True), primary_key=True, default=uuid4)
    first_name: Mapped[str] = mapped_column(String)
    last_name: Mapped[str] = mapped_column(String)
    date_of_birth: Mapped[datetime] = mapped_column(DateTime)
    email: Mapped[str] = mapped_column(String, nullable=True)
    phone: Mapped[str] = mapped_column(String, nullable=True)
    address: Mapped[str] = mapped_column(String, nullable=True)
    emergency_contact: Mapped[str] = mapped_column(String, nullable=True)
    emergency_phone: Mapped[str] = mapped_column(String, nullable=True)
    medical_history: Mapped[str] = mapped_column(String, nullable=True)
    insurance_info: Mapped[JSON] = mapped_column(JSON, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    assessments: Mapped[List['Assessment']] = relationship("Assessment", back_populates="client")

class Therapist(Base):
    __tablename__ = "therapists"

    id: Mapped[UUID] = mapped_column(PUUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(PUUID(as_uuid=True), ForeignKey("users.id"))
    license_number: Mapped[str] = mapped_column(String)
    license_state: Mapped[str] = mapped_column(String)
    license_expiry: Mapped[datetime] = mapped_column(DateTime)
    specializations: Mapped[JSON] = mapped_column(JSON, default=list)
    years_of_experience: Mapped[int] = mapped_column(Integer, nullable=True)
    bio: Mapped[str] = mapped_column(String, nullable=True)
    assessment_count: Mapped[int] = mapped_column(Integer, default=0)
    rating: Mapped[float] = mapped_column(Float, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user: Mapped[User] = relationship("User", back_populates="therapist")
    assessments: Mapped[List['Assessment']] = relationship("Assessment", back_populates="therapist")

class Assessment(Base):
    __tablename__ = "assessments"

    id: Mapped[UUID] = mapped_column(PUUID(as_uuid=True), primary_key=True, default=uuid4)
    client_id: Mapped[UUID] = mapped_column(PUUID(as_uuid=True), ForeignKey("clients.id"))
    therapist_id: Mapped[UUID] = mapped_column(PUUID(as_uuid=True), ForeignKey("therapists.id"))
    type: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)
    data: Mapped[JSON] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    client: Mapped[Client] = relationship("Client", back_populates="assessments")
    therapist: Mapped[Therapist] = relationship("Therapist", back_populates="assessments")
    report: Mapped['Report'] = relationship("Report", back_populates="assessment", uselist=False)

class Report(Base):
    __tablename__ = "reports"

    id: Mapped[UUID] = mapped_column(PUUID(as_uuid=True), primary_key=True, default=uuid4)
    assessment_id: Mapped[UUID] = mapped_column(PUUID(as_uuid=True), ForeignKey("assessments.id"))
    template_id: Mapped[UUID] = mapped_column(PUUID(as_uuid=True), ForeignKey("templates.id"))
    content: Mapped[JSON] = mapped_column(JSON)
    status: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    assessment: Mapped[Assessment] = relationship("Assessment", back_populates="report")
    template: Mapped['Template'] = relationship("Template")

class Template(Base):
    __tablename__ = "templates"

    id: Mapped[UUID] = mapped_column(PUUID(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String)
    version: Mapped[str] = mapped_column(String)
    schema: Mapped[JSON] = mapped_column(JSON)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)