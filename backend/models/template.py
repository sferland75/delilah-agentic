from sqlalchemy import Column, String, JSON, DateTime, Enum, ForeignKey, Integer
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import enum
from uuid import uuid4

class TemplateStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    ARCHIVED = "archived"

class ScoringMethod(str, enum.Enum):
    SUM = "sum"
    AVERAGE = "average"
    CUSTOM = "custom"

class Template(Base):
    __tablename__ = "templates"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    name = Column(String, nullable=False)
    description = Column(String)
    version = Column(String, nullable=False)
    status = Column(Enum(TemplateStatus), nullable=False, default=TemplateStatus.DRAFT)
    sections = Column(JSON, nullable=False, default=list)
    scoring = Column(JSON, nullable=False)
    category_id = Column(String, ForeignKey("categories.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String, ForeignKey("users.id"), nullable=False)

    # Relationships
    category = relationship("Category", back_populates="templates")
    assessments = relationship("Assessment", back_populates="template")
    created_by_user = relationship("User", back_populates="created_templates")

    def __repr__(self):
        return f"<Template {self.name} v{self.version}>"