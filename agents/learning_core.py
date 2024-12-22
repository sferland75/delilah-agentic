from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple
from uuid import UUID
from pydantic import BaseModel, Field
import asyncio
import json

class LearningEvent(BaseModel):
    """Model for capturing learning events"""
    event_type: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    context_id: Optional[UUID]
    data: Dict[str, Any]
    outcome: Dict[str, Any]
    metadata: Dict[str, Any] = Field(default_factory=dict)

class LearningPattern(BaseModel):
    """Model for identified learning patterns"""
    pattern_type: str
    confidence: float = Field(ge=0.0, le=1.0)
    supporting_events: List[UUID]
    discovered_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = Field(default_factory=dict)

class AgentLearningCore:
    """Core learning system for agent behavior adaptation"""
    
    def __init__(self):
        self._events: Dict[UUID, LearningEvent] = {}
        self._patterns: Dict[UUID, LearningPattern] = {}
        self._event_types: Dict[str, List[UUID]] = {}
        self._lock = asyncio.Lock()
        self._pattern_confidence_threshold = 0.8

    async def record_event(self, 
                         event_type: str,
                         context_id: Optional[UUID],
                         data: Dict[str, Any],
                         outcome: Dict[str, Any],
                         metadata: Optional[Dict[str, Any]] = None) -> UUID:
        """Record a learning event for analysis"""
        event = LearningEvent(
            event_type=event_type,
            context_id=context_id,
            data=data,
            outcome=outcome,
            metadata=metadata or {}
        )
        
        async with self._lock:
            event_id = UUID(int=len(self._events))
            self._events[event_id] = event
            
            if event_type not in self._event_types:
                self._event_types[event_type] = []
            self._event_types[event_type].append(event_id)
            
            # Trigger pattern analysis if we have enough events
            if len(self._event_types[event_type]) >= 5:
                await self._analyze_patterns(event_type)
            
            return event_id

    async def _analyze_patterns(self, event_type: str) -> None:
        """Analyze events for emerging patterns"""
        events = [
            self._events[event_id] 
            for event_id in self._event_types[event_type][-10:]  # Analyze last 10 events
        ]
        
        # Analyze outcomes
        success_rate = sum(
            1 for e in events 
            if e.outcome.get('success', False)
        ) / len(events)
        
        # Look for common factors in successful events
        successful_events = [
            e for e in events 
            if e.outcome.get('success', False)
        ]
        
        if successful_events:
            common_factors = self._extract_common_factors(successful_events)
            if common_factors and success_rate >= self._pattern_confidence_threshold:
                pattern = LearningPattern(
                    pattern_type=f"{event_type}_success_pattern",
                    confidence=success_rate,
                    supporting_events=[
                        event_id for event_id in self._event_types[event_type]
                        if self._events[event_id].outcome.get('success', False)
                    ],
                    metadata={
                        'common_factors': common_factors,
                        'success_rate': success_rate
                    }
                )
                
                pattern_id = UUID(int=len(self._patterns))
                self._patterns[pattern_id] = pattern

    def _extract_common_factors(self, events: List[LearningEvent]) -> Dict[str, Any]:
        """Extract common factors from a set of events"""
        if not events:
            return {}
            
        # Start with all keys from the first event
        common_keys = set(events[0].data.keys())
        
        # Find intersection of keys across all events
        for event in events[1:]:
            common_keys &= set(event.data.keys())
            
        common_factors = {}
        for key in common_keys:
            # Get all values for this key
            values = [e.data[key] for e in events]
            
            # If all values are the same, this is a common factor
            if len(set(str(v) for v in values)) == 1:
                common_factors[key] = values[0]
                
        return common_factors

    async def get_patterns(self, 
                         event_type: Optional[str] = None,
                         min_confidence: float = 0.0) -> List[Tuple[UUID, LearningPattern]]:
        """Retrieve identified patterns with optional filtering"""
        async with self._lock:
            patterns = [
                (pid, pattern) 
                for pid, pattern in self._patterns.items()
                if pattern.confidence >= min_confidence
                and (not event_type or pattern.pattern_type.startswith(event_type))
            ]
            return sorted(patterns, key=lambda x: x[1].confidence, reverse=True)

    async def apply_pattern(self,
                          pattern_id: UUID,
                          data: Dict[str, Any]) -> Dict[str, Any]:
        """Apply a learned pattern to new data"""
        async with self._lock:
            if pattern_id not in self._patterns:
                raise ValueError(f"Pattern {pattern_id} not found")
                
            pattern = self._patterns[pattern_id]
            common_factors = pattern.metadata.get('common_factors', {})
            
            # Apply pattern by incorporating common factors
            enhanced_data = {**data}
            for key, value in common_factors.items():
                if key not in enhanced_data:
                    enhanced_data[key] = value
                    
            return enhanced_data