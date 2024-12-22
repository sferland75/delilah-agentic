from datetime import datetime
from typing import Dict, Any
from uuid import UUID
from sqlalchemy import Column, DateTime, Float, Integer, String, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from database.base import Base

class LearningMetric(Base):
    __tablename__ = 'learning_metrics'

    id = Column(PGUUID, primary_key=True)
    agent_id = Column(PGUUID, nullable=False)
    metric_type = Column(String, nullable=False)
    value = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    metadata = Column(JSON, default={})

    __table_args__ = (
        # Add index on timestamp for efficient queries
        Index('idx_learning_metrics_timestamp', 'timestamp'),
        # Add index on agent_id and timestamp for filtered queries
        Index('idx_learning_metrics_agent_timestamp', 'agent_id', 'timestamp'),
    )

class PatternMetric(Base):
    __tablename__ = 'pattern_metrics'

    id = Column(PGUUID, primary_key=True)
    agent_id = Column(PGUUID, nullable=False)
    pattern_id = Column(PGUUID, nullable=False)
    confidence = Column(Float, nullable=False)
    usage_count = Column(Integer, default=0)
    success_rate = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    metadata = Column(JSON, default={})

    __table_args__ = (
        # Add index on confidence for filtering
        Index('idx_pattern_metrics_confidence', 'confidence'),
        # Add index on agent_id and timestamp
        Index('idx_pattern_metrics_agent_timestamp', 'agent_id', 'timestamp'),
        # Add unique constraint on agent_id and pattern_id
        UniqueConstraint('agent_id', 'pattern_id', name='uq_agent_pattern'),
    )