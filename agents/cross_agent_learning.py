from typing import Dict, List, Optional, Set, Tuple
from uuid import UUID
from datetime import datetime
import asyncio
from pydantic import BaseModel, Field

from .learning_core import LearningPattern, AgentLearningCore

class CrossAgentPattern(BaseModel):
    """Model for patterns that span multiple agents"""
    source_patterns: List[UUID]
    agent_types: Set[str]
    correlation_strength: float = Field(ge=0.0, le=1.0)
    pattern_signature: str
    discovered_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, any] = Field(default_factory=dict)

class CrossAgentLearning:
    """Manages learning pattern sharing and correlation between different agent types"""
    
    def __init__(self):
        self._cross_patterns: Dict[UUID, CrossAgentPattern] = {}
        self._agent_cores: Dict[str, AgentLearningCore] = {}
        self._lock = asyncio.Lock()
        self._correlation_threshold = 0.75
        
    def register_agent(self, agent_type: str, learning_core: AgentLearningCore) -> None:
        """Register an agent's learning core for cross-agent pattern analysis"""
        self._agent_cores[agent_type] = learning_core
        
    async def analyze_cross_patterns(self, 
                                   source_agent: str,
                                   target_agent: str,
                                   pattern_types: Optional[List[str]] = None,
                                   min_confidence: float = 0.8) -> List[CrossAgentPattern]:
        """Analyze patterns between two agent types for correlations"""
        async with self._lock:
            if source_agent not in self._agent_cores or target_agent not in self._agent_cores:
                raise ValueError(f"Both agents must be registered")
                
            # Get patterns from both agents
            source_patterns = await self._agent_cores[source_agent].get_patterns(
                min_confidence=min_confidence
            )
            target_patterns = await self._agent_cores[target_agent].get_patterns(
                min_confidence=min_confidence
            )
            
            new_cross_patterns = []
            
            # Compare patterns for correlations
            for source_id, source_pattern in source_patterns:
                for target_id, target_pattern in target_patterns:
                    correlation = await self._calculate_pattern_correlation(
                        source_pattern, target_pattern
                    )
                    
                    if correlation >= self._correlation_threshold:
                        cross_pattern = CrossAgentPattern(
                            source_patterns=[source_id, target_id],
                            agent_types={source_agent, target_agent},
                            correlation_strength=correlation,
                            pattern_signature=self._generate_pattern_signature(
                                source_pattern, target_pattern
                            ),
                            metadata={
                                'source_metadata': source_pattern.metadata,
                                'target_metadata': target_pattern.metadata,
                                'correlation_factors': await self._extract_correlation_factors(
                                    source_pattern, target_pattern
                                )
                            }
                        )
                        
                        pattern_id = UUID(int=len(self._cross_patterns))
                        self._cross_patterns[pattern_id] = cross_pattern
                        new_cross_patterns.append(cross_pattern)
            
            return new_cross_patterns
    
    async def _calculate_pattern_correlation(self,
                                          pattern1: LearningPattern,
                                          pattern2: LearningPattern) -> float:
        """Calculate correlation strength between two patterns"""
        # Compare common factors in metadata
        factors1 = pattern1.metadata.get('common_factors', {})
        factors2 = pattern2.metadata.get('common_factors', {})
        
        common_keys = set(factors1.keys()) & set(factors2.keys())
        if not common_keys:
            return 0.0
            
        # Calculate correlation based on shared factors and success rates
        factor_correlation = sum(
            1 for key in common_keys
            if str(factors1[key]) == str(factors2[key])
        ) / len(common_keys)
        
        success_correlation = abs(
            pattern1.metadata.get('success_rate', 0) -
            pattern2.metadata.get('success_rate', 0)
        )
        
        # Weighted combination of correlations
        return 0.7 * factor_correlation + 0.3 * (1 - success_correlation)
    
    async def _extract_correlation_factors(self,
                                        pattern1: LearningPattern,
                                        pattern2: LearningPattern) -> Dict[str, any]:
        """Extract factors that correlate between patterns"""
        factors1 = pattern1.metadata.get('common_factors', {})
        factors2 = pattern2.metadata.get('common_factors', {})
        
        correlation_factors = {}
        for key in set(factors1.keys()) & set(factors2.keys()):
            if str(factors1[key]) == str(factors2[key]):
                correlation_factors[key] = factors1[key]
                
        return correlation_factors
    
    def _generate_pattern_signature(self,
                                 pattern1: LearningPattern,
                                 pattern2: LearningPattern) -> str:
        """Generate a unique signature for the cross-agent pattern"""
        factors = self._extract_correlation_factors(pattern1, pattern2)
        signature_parts = [
            f"{k}:{v}"
            for k, v in sorted(factors.items())
        ]
        return f"{pattern1.pattern_type}:{pattern2.pattern_type}:" + ",".join(signature_parts)
    
    async def apply_cross_pattern(self,
                                pattern_id: UUID,
                                agent_type: str,
                                data: Dict[str, any]) -> Dict[str, any]:
        """Apply a cross-agent pattern to enhance data for a specific agent"""
        async with self._lock:
            if pattern_id not in self._cross_patterns:
                raise ValueError(f"Cross-pattern {pattern_id} not found")
                
            pattern = self._cross_patterns[pattern_id]
            if agent_type not in pattern.agent_types:
                raise ValueError(f"Pattern not applicable to agent type {agent_type}")
                
            # Apply correlation factors to enhance data
            correlation_factors = pattern.metadata.get('correlation_factors', {})
            enhanced_data = {**data}
            
            for key, value in correlation_factors.items():
                if key not in enhanced_data:
                    enhanced_data[key] = value
                    
            return enhanced_data