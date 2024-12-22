from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Query
from pydantic import BaseModel
from uuid import UUID

from agents.cross_agent_learning import CrossAgentLearning
from monitoring.metrics import MetricsCollector

router = APIRouter(prefix="/api/monitoring/learning")

class CrossPatternData(BaseModel):
    pattern_id: str
    source_agent: str
    target_agent: str
    correlation_strength: float
    pattern_signature: str
    discovered_at: datetime
    metadata: Dict[str, Any]

class CrossAgentMetrics(BaseModel):
    total_patterns: int
    avg_correlation: float
    strongest_correlations: List[CrossPatternData]
    pattern_evolution: List[Dict[str, Any]]
    agent_relationships: List[Dict[str, Any]]

@router.get("/metrics")
async def get_learning_metrics(
    agent: str = Query(default="all", description="Filter by agent ID"),
    timeRange: str = Query(default="24h", description="Time range for metrics")
) -> Dict[str, Any]:
    """Get learning metrics for specified agent(s)"""
    # Existing metrics endpoint implementation
    pass

@router.get("/cross-patterns")
async def get_cross_pattern_metrics(
    timeRange: str = Query(default="24h", description="Time range for metrics"),
    agent: Optional[str] = Query(default=None, description="Optional agent filter")
) -> CrossAgentMetrics:
    """Get cross-agent pattern metrics and relationships"""
    # Calculate time range
    end_time = datetime.utcnow()
    if timeRange == "24h":
        start_time = end_time - timedelta(hours=24)
        interval = timedelta(hours=1)
    elif timeRange == "7d":
        start_time = end_time - timedelta(days=7)
        interval = timedelta(hours=6)
    else:  # 30d
        start_time = end_time - timedelta(days=30)
        interval = timedelta(days=1)

    # Get cross-agent learning instance
    cal = CrossAgentLearning.get_instance()
    
    # Get all patterns within time range
    all_patterns = await cal.get_patterns_in_timerange(
        start_time=start_time,
        end_time=end_time,
        agent_type=agent if agent else None
    )
    
    # Calculate overall metrics
    total_patterns = len(all_patterns)
    avg_correlation = sum(p.correlation_strength for p in all_patterns) / max(1, total_patterns)
    
    # Get strongest correlations
    strongest_correlations = sorted(
        all_patterns,
        key=lambda p: p.correlation_strength,
        reverse=True
    )[:10]
    
    # Calculate pattern evolution
    evolution_data = []
    current_time = start_time
    
    while current_time <= end_time:
        interval_end = min(current_time + interval, end_time)
        interval_patterns = [p for p in all_patterns 
                           if current_time <= p.discovered_at < interval_end]
        
        evolution_data.append({
            "timestamp": current_time.isoformat(),
            "pattern_count": len(interval_patterns),
            "avg_strength": sum(p.correlation_strength for p in interval_patterns) 
                          / max(1, len(interval_patterns))
        })
        
        current_time += interval
    
    # Calculate agent relationships
    relationships = {}
    for pattern in all_patterns:
        relationship_key = f"{pattern.source_agent}:{pattern.target_agent}"
        if relationship_key not in relationships:
            relationships[relationship_key] = {
                "source": pattern.source_agent,
                "target": pattern.target_agent,
                "value": 0,
                "patterns": 0
            }
        
        relationships[relationship_key]["value"] += pattern.correlation_strength
        relationships[relationship_key]["patterns"] += 1
    
    # Normalize relationship values
    for rel in relationships.values():
        rel["value"] = rel["value"] / rel["patterns"]
    
    return CrossAgentMetrics(
        total_patterns=total_patterns,
        avg_correlation=avg_correlation,
        strongest_correlations=[
            CrossPatternData(
                pattern_id=str(p.source_patterns[0]),
                source_agent=p.source_agent,
                target_agent=p.target_agent,
                correlation_strength=p.correlation_strength,
                pattern_signature=p.pattern_signature,
                discovered_at=p.discovered_at,
                metadata=p.metadata
            ) for p in strongest_correlations
        ],
        pattern_evolution=evolution_data,
        agent_relationships=list(relationships.values())
    )

class PatternHistoryEntry(BaseModel):
    timestamp: datetime
    patterns_added: int
    patterns_evolved: int
    avg_correlation: float
    agent_pairs: List[str]

@router.get("/cross-patterns/history")
async def get_cross_pattern_history(
    timeRange: str = Query(default="24h", description="Time range for history"),
    agent: Optional[str] = Query(default=None, description="Optional agent filter")
) -> List[PatternHistoryEntry]:
    """Get historical data about cross-agent pattern evolution"""
    # Calculate time range
    end_time = datetime.utcnow()
    if timeRange == "24h":
        start_time = end_time - timedelta(hours=24)
        interval = timedelta(hours=1)
    elif timeRange == "7d":
        start_time = end_time - timedelta(days=7)
        interval = timedelta(hours=6)
    else:  # 30d
        start_time = end_time - timedelta(days=30)
        interval = timedelta(days=1)

    # Get cross-agent learning instance
    cal = CrossAgentLearning.get_instance()
    
    # Get pattern history within time range
    history_entries = []
    current_time = start_time
    
    while current_time <= end_time:
        interval_end = min(current_time + interval, end_time)
        
        # Get patterns in this interval
        interval_data = await cal.get_pattern_history(
            start_time=current_time,
            end_time=interval_end,
            agent_type=agent if agent else None
        )
        
        history_entries.append(
            PatternHistoryEntry(
                timestamp=current_time,
                patterns_added=interval_data.patterns_added,
                patterns_evolved=interval_data.patterns_evolved,
                avg_correlation=interval_data.avg_correlation,
                agent_pairs=interval_data.agent_pairs
            )
        )
        
        current_time += interval
    
    return history_entries