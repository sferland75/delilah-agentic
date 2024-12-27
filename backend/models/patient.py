from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin
import enum

class Gender(enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"

class Patient(Base, TimestampMixin):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String, unique=True, index=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(Enum(Gender), nullable=False)
    contact_number = Column(String)
    email = Column(String)
    address = Column(Text)
    medical_history = Column(Text)
    therapist_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    therapist = relationship("User", back_populates="patients")
    assessments = relationship("Assessment", back_populates="patient")