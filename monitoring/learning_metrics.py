from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from uuid import UUID
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.session import get_db
from database.models.learning import LearningMetric, PatternMetric

router = APIRouter(prefix='/monitoring/learning', tags=['learning_metrics'])

class LearningMetricBase(BaseModel):
    agent_id: UUID
    metric_type: str
    value: float
    timestamp: datetime = datetime.utcnow()
    metadata: Dict[str, Any] = {}

class PatternMetricBase(BaseModel):
    agent_id: UUID
    pattern_id: UUID
    confidence: float
    usage_count: int
    success_rate: float
    timestamp: datetime = datetime.utcnow()
    metadata: Dict[str, Any] = {}

@router.post('/metrics')
async def record_learning_metric(
    metric: LearningMetricBase,
    db: Session = Depends(get_db)
):
    """Record a learning metric"""
    db_metric = LearningMetric(**metric.dict())
    db.add(db_metric)
    db.commit()
    return {"status": "success", "id": db_metric.id}

@router.post('/patterns')
async def record_pattern_metric(
    metric: PatternMetricBase,
    db: Session = Depends(get_db)
):
    """Record a pattern metric"""
    db_metric = PatternMetric(**metric.dict())
    db.add(db_metric)
    db.commit()
    return {"status": "success", "id": db_metric.id}

@router.get('/metrics/{agent_id}')
async def get_agent_metrics(
    agent_id: UUID,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    metric_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get learning metrics for a specific agent"""
    query = db.query(LearningMetric).filter(LearningMetric.agent_id == agent_id)
    
    if start_time:
        query = query.filter(LearningMetric.timestamp >= start_time)
    if end_time:
        query = query.filter(LearningMetric.timestamp <= end_time)
    if metric_type:
        query = query.filter(LearningMetric.metric_type == metric_type)
        
    return query.all()

@router.get('/patterns/{agent_id}')
async def get_agent_patterns(
    agent_id: UUID,
    min_confidence: float = 0.0,
    db: Session = Depends(get_db)
):
    """Get pattern metrics for a specific agent"""
    patterns = db.query(PatternMetric)\
        .filter(PatternMetric.agent_id == agent_id)\
        .filter(PatternMetric.confidence >= min_confidence)\
        .all()
        
    return patterns

@router.get('/system')
async def get_system_metrics(
    time_window: Optional[int] = 24,  # hours
    db: Session = Depends(get_db)
):
    """Get system-wide learning metrics"""
    start_time = datetime.utcnow() - timedelta(hours=time_window)
    
    metrics = db.query(LearningMetric)\
        .filter(LearningMetric.timestamp >= start_time)\
        .all()
        
    patterns = db.query(PatternMetric)\
        .filter(PatternMetric.timestamp >= start_time)\
        .all()
        
    return {
        "total_metrics": len(metrics),
        "total_patterns": len(patterns),
        "pattern_confidence_avg": sum(p.confidence for p in patterns) / len(patterns) if patterns else 0,
        "pattern_success_rate_avg": sum(p.success_rate for p in patterns) / len(patterns) if patterns else 0,
        "metrics_by_type": _aggregate_metrics_by_type(metrics),
        "time_window_hours": time_window
    }

def _aggregate_metrics_by_type(metrics: List[LearningMetric]) -> Dict[str, Dict[str, float]]:
    """Aggregate metrics by type with basic statistics"""
    aggregated = {}
    
    for metric in metrics:
        if metric.metric_type not in aggregated:
            aggregated[metric.metric_type] = {
                'count': 0,
                'sum': 0.0,
                'min': float('inf'),
                'max': float('-inf')
            }
            
        stats = aggregated[metric.metric_type]
        stats['count'] += 1
        stats['sum'] += metric.value
        stats['min'] = min(stats['min'], metric.value)
        stats['max'] = max(stats['max'], metric.value)
        
    # Calculate averages
    for stats in aggregated.values():
        stats['avg'] = stats['sum'] / stats['count']
        
    return aggregated