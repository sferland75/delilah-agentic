from sqlalchemy import Column, String, Boolean, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .base import Base, TimestampMixin

class Client(Base, TimestampMixin):
    __tablename__ = 'clients'
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=False)
    email = Column(String)
    phone = Column(String)
    active = Column(Boolean, default=True)
    
    # Relationships
    assessments = relationship('Assessment', back_populates='client')