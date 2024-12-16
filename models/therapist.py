from sqlalchemy import Column, String, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin

class Therapist(Base, TimestampMixin):
    __tablename__ = 'therapists'
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    license_number = Column(String, unique=True)
    specializations = Column(ARRAY(String), default=[])
    is_active = Column(Boolean, default=True)
    preferences = Column(JSON, default={})
    
    # Relationships
    assessments = relationship('Assessment', back_populates='therapist')