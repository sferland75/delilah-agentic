from typing import Dict, Any, Optional, List
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field
from .base import AgentType, AgentContext
from .agent_learning import LearningEnabledAgent

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
    
    def __init__(self, name: str):
        super().__init__(
            agent_type=AgentType.ANALYSIS,
            name=name
        )
        self._data_source_stats: Dict[str, DataSourceStats] = {}
        self._analysis_history: Dict[UUID, Dict[str, Any]] = {}

    async def process_task(self, task: Dict[str, Any], context: AgentContext) -> Dict[str, Any]:
        """Process an analysis task with learning optimization"""
        # Validate parameters
        parameters = AnalysisParameters(**task.get('parameters', {}))
        
        # Initialize analysis tracking
        self._analysis_history[context.session_id] = {
            'start_time': datetime.utcnow(),
            'parameters': parameters.dict(),
            'data_source_stats': None,
            'optimizations_applied': []
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
            
            # Execute analysis
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
        insights.update({
            'data_sources_analyzed': len(self._data_source_stats),
            'analysis_patterns': len(patterns),
            'optimization_impact': self._calculate_optimization_impact(patterns)
        })
        
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