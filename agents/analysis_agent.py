from typing import Dict, Any, Optional, List, Tuple
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field
from .base import AgentType, AgentContext
from .agent_learning import LearningEnabledAgent
from .cross_agent_learning import CrossAgentLearning

class AnalysisParameters(BaseModel):
    """Parameters for analysis tasks"""
    analysis_type: str
    data_source: str
    metrics: List[str]
    filters: Optional[Dict[str, Any]] = None
    aggregations: Optional[Dict[str, str]] = None
    custom_parameters: Optional[Dict[str, Any]] = None

class DataSourceStats(BaseModel):
    """Statistics about a data source"""
    total_records: int
    field_types: Dict[str, str]
    value_ranges: Dict[str, Dict[str, Any]]
    missing_values: Dict[str, int]

class LearningAnalysisAgent(LearningEnabledAgent):
    """Analysis agent with learning capabilities"""
    
    def __init__(self, name: str, cross_learning: Optional[CrossAgentLearning] = None):
        super().__init__(
            agent_type=AgentType.ANALYSIS,
            name=name
        )
        self._data_source_stats: Dict[str, DataSourceStats] = {}
        self._analysis_history: Dict[UUID, Dict[str, Any]] = {}
        self._cross_learning = cross_learning
        
        # Register with cross-agent learning if provided
        if cross_learning:
            cross_learning.register_agent(self.agent_type.value, self.learning_core)

    async def process_task(self, task: Dict[str, Any], context: AgentContext) -> Dict[str, Any]:
        """Process an analysis task with learning optimization"""
        # Validate parameters
        parameters = AnalysisParameters(**task.get('parameters', {}))
        
        # Initialize analysis tracking
        self._analysis_history[context.session_id] = {
            'start_time': datetime.utcnow(),
            'parameters': parameters.dict(),
            'data_source_stats': None,
            'optimizations_applied': [],
            'cross_agent_patterns_applied': []
        }
        
        try:
            # Analyze data source if not cached
            if parameters.data_source not in self._data_source_stats:
                stats = await self._analyze_data_source(parameters.data_source)
                self._data_source_stats[parameters.data_source] = stats
                self._analysis_history[context.session_id]['data_source_stats'] = stats.dict()
            
            # Get relevant learning patterns
            patterns = await self.learning_core.get_patterns(
                event_type=f"analysis_{parameters.analysis_type}",
                min_confidence=0.8
            )
            
            # Apply learned optimizations
            optimized_task = task
            if patterns:
                pattern_id, pattern = patterns[0]
                optimized_task = await self.learning_core.apply_pattern(pattern_id, task)
                self._analysis_history[context.session_id]['optimizations_applied'].append({
                    'pattern_id': str(pattern_id),
                    'confidence': pattern.confidence,
                    'timestamp': datetime.utcnow().isoformat()
                })
                
                # Apply cross-agent patterns if available
                if self._cross_learning:
                    cross_patterns = await self._cross_learning.analyze_cross_patterns(
                        source_agent=self.agent_type.value,
                        target_agent=AgentType.ASSESSMENT.value,
                        min_confidence=0.8
                    )
                    
                    for cross_pattern in cross_patterns:
                        optimized_task = await self._cross_learning.apply_cross_pattern(
                            pattern_id=cross_pattern.source_patterns[0],
                            agent_type=self.agent_type.value,
                            data=optimized_task
                        )
                        
                        self._analysis_history[context.session_id]['cross_agent_patterns_applied'].append({
                            'pattern_id': str(cross_pattern.source_patterns[0]),
                            'correlation_strength': cross_pattern.correlation_strength,
                            'timestamp': datetime.utcnow().isoformat()
                        })
            
            # Execute analysis with optimized parameters
            result = await self._execute_analysis(optimized_task, parameters)
            
            # Record successful completion
            await self._record_analysis_completion(context.session_id, True, result)
            
            return result
            
        except Exception as e:
            # Record failed completion
            await self._record_analysis_completion(context.session_id, False, error=str(e))
            raise

    async def _analyze_data_source(self, data_source: str) -> DataSourceStats:
        """Analyze a data source to gather statistics"""
        # Implementation will depend on data source type
        raise NotImplementedError()

    async def _execute_analysis(self, 
                              task: Dict[str, Any],
                              parameters: AnalysisParameters) -> Dict[str, Any]:
        """Execute the analysis with the given parameters"""
        # Implementation will depend on analysis type
        raise NotImplementedError()

    async def _record_analysis_completion(self,
                                        session_id: UUID,
                                        success: bool,
                                        result: Optional[Dict[str, Any]] = None,
                                        error: Optional[str] = None) -> None:
        """Record analysis completion for learning"""
        if session_id in self._analysis_history:
            history = self._analysis_history[session_id]
            duration = (datetime.utcnow() - history['start_time']).total_seconds()
            
            # Record learning event
            await self.learning_core.record_event(
                event_type=f"analysis_{history['parameters']['analysis_type']}",
                context_id=session_id,
                data={
                    'parameters': history['parameters'],
                    'data_source_stats': history['data_source_stats'],
                    'optimizations': history['optimizations_applied'],
                    'cross_agent_patterns': history['cross_agent_patterns_applied'],
                    'duration': duration
                },
                outcome={
                    'success': success,
                    'error': error if error else None,
                    'result_summary': self._summarize_result(result) if result else None
                }
            )
            
            del self._analysis_history[session_id]

    def _summarize_result(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Create a summary of analysis results for learning purposes"""
        if not result:
            return {}
            
        return {
            'metrics_computed': list(result.get('metrics', {}).keys()),
            'record_count': result.get('record_count', 0),
            'execution_time': result.get('execution_time', 0),
            'optimizations_used': result.get('optimizations_used', [])
        }

    async def get_analysis_insights(self, 
                                  analysis_type: Optional[str] = None) -> Dict[str, Any]:
        """Get insights about analysis patterns and performance"""
        insights = await super().get_learning_insights()
        
        # Get analysis-specific patterns
        patterns = await self.learning_core.get_patterns(
            event_type=f"analysis_{analysis_type}" if analysis_type else "analysis"
        )
        
        # Add analysis-specific insights
        base_insights = {
            'data_sources_analyzed': len(self._data_source_stats),
            'analysis_patterns': len(patterns),
            'optimization_impact': self._calculate_optimization_impact(patterns)
        }
        
        # Add cross-agent insights if available
        if self._cross_learning:
            cross_patterns = await self._cross_learning.analyze_cross_patterns(
                source_agent=self.agent_type.value,
                target_agent=AgentType.ASSESSMENT.value,
                min_confidence=0.8
            )
            
            base_insights.update({
                'cross_agent_patterns': len(cross_patterns),
                'cross_agent_impact': self._calculate_cross_agent_impact(cross_patterns),
                'assessment_correlations': [
                    {
                        'correlation_strength': p.correlation_strength,
                        'pattern_type': p.pattern_signature.split(':')[0],
                        'correlation_factors': p.metadata.get('correlation_factors', {})
                    }
                    for p in cross_patterns
                ]
            })
        
        insights.update(base_insights)
        return insights

    def _calculate_optimization_impact(self, 
                                     patterns: List[Tuple[UUID, LearningPattern]]) -> Dict[str, Any]:
        """Calculate the impact of learned optimizations"""
        if not patterns:
            return {'status': 'insufficient_data'}
            
        successful_patterns = [p for _, p in patterns 
                             if p.metadata.get('success_rate', 0) >= 0.8]
        
        if not successful_patterns:
            return {'status': 'no_successful_patterns'}
            
        # Calculate average improvements
        duration_improvements = []
        for pattern in successful_patterns:
            original_duration = pattern.metadata.get('original_duration', 0)
            optimized_duration = pattern.metadata.get('optimized_duration', 0)
            if original_duration and optimized_duration:
                improvement = (original_duration - optimized_duration) / original_duration
                duration_improvements.append(improvement)
        
        return {
            'status': 'active',
            'successful_patterns': len(successful_patterns),
            'avg_duration_improvement': sum(duration_improvements) / len(duration_improvements) 
                                      if duration_improvements else 0,
            'total_improvements': len(duration_improvements)
        }
        
    def _calculate_cross_agent_impact(self, cross_patterns: List[CrossAgentPattern]) -> Dict[str, Any]:
        """Calculate the impact of cross-agent learning patterns"""
        if not cross_patterns:
            return {'status': 'insufficient_data'}
            
        strong_correlations = [p for p in cross_patterns if p.correlation_strength >= 0.9]
        
        if not strong_correlations:
            return {'status': 'no_strong_correlations'}
            
        return {
            'status': 'active',
            'strong_correlations': len(strong_correlations),
            'avg_correlation_strength': sum(p.correlation_strength for p in cross_patterns) / len(cross_patterns),
            'common_correlation_factors': self._get_common_correlation_factors(cross_patterns)
        }
        
    def _get_common_correlation_factors(self, patterns: List[CrossAgentPattern]) -> Dict[str, int]:
        """Identify commonly occurring correlation factors across patterns"""
        factor_counts: Dict[str, int] = {}
        
        for pattern in patterns:
            factors = pattern.metadata.get('correlation_factors', {})
            for factor in factors.keys():
                factor_counts[factor] = factor_counts.get(factor, 0) + 1
                
        return factor_counts