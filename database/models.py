from sqlalchemy import Column, String, UUID, DateTime, Boolean, JSON, ForeignKey, Integer, Date
from sqlalchemy.sql import func
from .db import Base
import uuid

class Client(Base):
    __tablename__ = 'clients'
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(Date)
    address = Column(String)
    phone = Column(String)
    email = Column(String)
    insurance_provider = Column(String)
    claim_number = Column(String)
    lawyer_name = Column(String)
    law_firm = Column(String)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Therapist(Base):
    __tablename__ = 'therapists'
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    registration_number = Column(String, nullable=False)
    credentials = Column(String)
    email = Column(String)
    phone = Column(String)
    status = Column(String, default='active')
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class AssessmentTemplate(Base):
    __tablename__ = 'assessment_templates'
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    version = Column(String, nullable=False)
    structure = Column(JSON, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Assessment(Base):
    __tablename__ = 'assessments'
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    client_id = Column(UUID, ForeignKey('clients.id'))
    therapist_id = Column(UUID, ForeignKey('therapists.id'))
    template_id = Column(UUID, ForeignKey('assessment_templates.id'))
    status = Column(String, default='draft')
    assessment_date = Column(Date, nullable=False)
    data = Column(JSON, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Report(Base):
    __tablename__ = 'reports'
    
    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    assessment_id = Column(UUID, ForeignKey('assessments.id'))
    version = Column(Integer, nullable=False)
    status = Column(String, default='draft')
    content = Column(JSON, nullable=False)
    pdf_path = Column(String)
    generated_at = Column(DateTime, nullable=False)
    approved_by = Column(UUID, ForeignKey('therapists.id'))
    approved_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())