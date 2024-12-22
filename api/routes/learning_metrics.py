from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.session import get_db
from database.models.learning import LearningMetric, PatternMetric
from pydantic import BaseModel

router = APIRouter(prefix="/api/monitoring/learning", tags=["learning"])

class MetricResponse(BaseModel):
    timestamp: str
    value: float
    agent_id: str
    metric_type: str

class PatternResponse(BaseModel):
    pattern_id: str
    agent_id: str
    confidence: float
    usage_count: int
    success_rate: float
    timestamp: str
    metadata: dict

class AgentPerformanceResponse(BaseModel):
    agent_id: str
    metrics: List[MetricResponse]
    patterns: List[PatternResponse]

class SystemHealthResponse(BaseModel):
    total_patterns: int
    active_patterns: int
    avg_success_rate: float
    avg_confidence: float
    total_agents: int
    patterns_by_type: Dict[str, int]
    agent_health: Dict[str, Dict[str, Any]]
    recent_errors: List[Dict[str, Any]]

def get_time_range(range_str: str) -> datetime:
    now = datetime.utcnow()
    if range_str == '24h':
        return now - timedelta(hours=24)
    elif range_str == '7d':
        return now - timedelta(days=7)
    elif range_str == '30d':
        return now - timedelta(days=30)
    else:
        return now - timedelta(hours=24)

@router.get("/metrics")
async def get_learning_metrics(
    agent: Optional[str] = Query(None),
    time_range: str = Query('24h', regex='^(24h|7d|30d)$'),
    db: Session = Depends(get_db)
) -> List[AgentPerformanceResponse]:
    """Get learning metrics for specified agents and time range"""
    start_time = get_time_range(time_range)
    
    # Base query for metrics
    metrics_query = db.query(LearningMetric).filter(
        LearningMetric.timestamp >= start_time
    )
    
    # Base query for patterns
    patterns_query = db.query(PatternMetric).filter(
        PatternMetric.timestamp >= start_time
    )
    
    # Apply agent filter if specified
    if agent and agent != 'all':
        metrics_query = metrics_query.filter(LearningMetric.agent_id == agent)
        patterns_query = patterns_query.filter(PatternMetric.agent_id == agent)
    
    # Execute queries
    metrics = metrics_query.all()
    patterns = patterns_query.all()
    
    # Group by agent
    agent_data = {}
    
    # Process metrics
    for metric in metrics:
        if metric.agent_id not in agent_data:
            agent_data[metric.agent_id] = {
                'metrics': [],
                'patterns': []
            }
        agent_data[metric.agent_id]['metrics'].append(
            MetricResponse(
                timestamp=metric.timestamp.isoformat(),
                value=metric.value,
                agent_id=metric.agent_id,
                metric_type=metric.metric_type
            )
        )
    
    # Process patterns
    for pattern in patterns:
        if pattern.agent_id not in agent_data:
            agent_data[pattern.agent_id] = {
                'metrics': [],
                'patterns': []
            }
        agent_data[pattern.agent_id]['patterns'].append(
            PatternResponse(
                pattern_id=str(pattern.id),
                agent_id=pattern.agent_id,
                confidence=pattern.confidence,
                usage_count=pattern.usage_count,
                success_rate=pattern.success_rate,
                timestamp=pattern.timestamp.isoformat(),
                metadata=pattern.metadata
            )
        )
    
    # Convert to response format
    return [
        AgentPerformanceResponse(
            agent_id=agent_id,
            metrics=data['metrics'],
            patterns=data['patterns']
        )
        for agent_id, data in agent_data.items()
    ]

@router.get("/system-health")
async def get_system_health(
    time_range: str = Query('24h', regex='^(24h|7d|30d)$'),
    db: Session = Depends(get_db)
) -> SystemHealthResponse:
    """Get overall system health metrics"""
    start_time = get_time_range(time_range)
    
    # Get pattern statistics
    pattern_stats = db.query(
        func.count(PatternMetric.id).label('total_patterns'),
        func.avg(PatternMetric.confidence).label('avg_confidence'),
        func.avg(PatternMetric.success_rate).label('avg_success_rate')
    ).filter(
        PatternMetric.timestamp >= start_time
    ).first()
    
    # Get active patterns (used in last 24 hours)
    active_patterns = db.query(func.count(PatternMetric.id)).filter(
        PatternMetric.timestamp >= datetime.utcnow() - timedelta(hours=24)
    ).scalar()
    
    # Get unique agents
    total_agents = db.query(func.count(func.distinct(LearningMetric.agent_id))).scalar()
    
    # Get patterns by type
    pattern_types = db.query(
        PatternMetric.metadata['type'].label('type'),
        func.count(PatternMetric.id)
    ).group_by('type').all()
    
    # Get agent health metrics
    agent_health = {}
    agents = db.query(func.distinct(LearningMetric.agent_id)).all()
    for (agent_id,) in agents:
        agent_metrics = db.query(LearningMetric).filter(
            LearningMetric.agent_id == agent_id,
            LearningMetric.timestamp >= start_time
        ).all()
        
        agent_patterns = db.query(PatternMetric).filter(
            PatternMetric.agent_id == agent_id,
            PatternMetric.timestamp >= start_time
        ).all()
        
        agent_health[agent_id] = {
            'total_metrics': len(agent_metrics),
            'total_patterns': len(agent_patterns),
            'avg_success_rate': sum(p.success_rate for p in agent_patterns) / len(agent_patterns) if agent_patterns else 0,
            'last_active': max(m.timestamp for m in agent_metrics).isoformat() if agent_metrics else None
        }
    
    # Get recent errors
    recent_errors = db.query(LearningMetric).filter(
        LearningMetric.metric_type == 'error',
        LearningMetric.timestamp >= start_time
    ).order_by(
        LearningMetric.timestamp.desc()
    ).limit(10).all()
    
    return SystemHealthResponse(
        total_patterns=pattern_stats.total_patterns,
        active_patterns=active_patterns,
        avg_success_rate=pattern_stats.avg_success_rate or 0.0,
        avg_confidence=pattern_stats.avg_confidence or 0.0,
        total_agents=total_agents,
        patterns_by_type={t: c for t, c in pattern_types},
        agent_health=agent_health,
        recent_errors=[{
            'timestamp': e.timestamp.isoformat(),
            'agent_id': e.agent_id,
            'error': e.metadata.get('error'),
            'context': e.metadata.get('context')
        } for e in recent_errors]
    )