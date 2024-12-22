from typing import Dict, Any, Optional, List, Tuple
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field
from .base import AgentType, AgentContext
from .agent_learning import LearningEnabledAgent

class ReportTemplate(BaseModel):
    """Model for report templates"""
    template_id: str
    sections: List[str]
    required_data: List[str]
    formatting: Dict[str, Any]
    metadata: Dict[str, Any] = Field(default_factory=dict)

class ReportParameters(BaseModel):
    """Parameters for report generation"""
    report_type: str
    template_id: str
    data_sources: List[str]
    target_format: str = 'pdf'
    include_sections: Optional[List[str]] = None
    custom_parameters: Optional[Dict[str, Any]] = None

class LearningReportAgent(LearningEnabledAgent):
    """Report generation agent with learning capabilities"""
    
    def __init__(self, name: str):
        super().__init__(
            agent_type=AgentType.REPORT,
            name=name
        )
        self._templates: Dict[str, ReportTemplate] = {}
        self._report_history: Dict[UUID, Dict[str, Any]] = {}

    async def process_task(self, task: Dict[str, Any], context: AgentContext) -> Dict[str, Any]:
        """Process a report generation task with learning optimization"""
        # Validate parameters
        parameters = ReportParameters(**task.get('parameters', {}))
        
        # Verify template exists
        if parameters.template_id not in self._templates:
            raise ValueError(f"Template {parameters.template_id} not found")
        
        # Initialize report tracking
        self._report_history[context.session_id] = {
            'start_time': datetime.utcnow(),
            'parameters': parameters.dict(),
            'template': self._templates[parameters.template_id].dict(),
            'optimizations_applied': []
        }
        
        try:
            # Get relevant learning patterns
            patterns = await self.learning_core.get_patterns(
                event_type=f"report_{parameters.report_type}",
                min_confidence=0.8
            )
            
            # Apply learned optimizations
            optimized_task = task
            if patterns:
                pattern_id, pattern = patterns[0]
                optimized_task = await self.learning_core.apply_pattern(pattern_id, task)
                self._report_history[context.session_id]['optimizations_applied'].append({
                    'pattern_id': str(pattern_id),
                    'confidence': pattern.confidence,
                    'timestamp': datetime.utcnow().isoformat()
                })
            
            # Generate report
            result = await self._generate_report(optimized_task, parameters)
            
            # Record successful completion
            await self._record_report_completion(context.session_id, True, result)
            
            return result
            
        except Exception as e:
            # Record failed completion
            await self._record_report_completion(context.session_id, False, error=str(e))
            raise

    async def _generate_report(self, 
                             task: Dict[str, Any],
                             parameters: ReportParameters) -> Dict[str, Any]:
        """Generate a report using the specified template and parameters"""
        template = self._templates[parameters.template_id]
        report_sections = parameters.include_sections or template.sections
        
        # Generate each section with potential optimizations
        sections = {}
        for section in report_sections:
            section_content = await self._generate_section(
                section,
                task,
                parameters,
                template
            )
            sections[section] = section_content
        
        return {
            'report_type': parameters.report_type,
            'template_id': parameters.template_id,
            'sections': sections,
            'metadata': {
                'generated_at': datetime.utcnow().isoformat(),
                'optimizations': self._report_history[task['context_id']]['optimizations_applied']
            }
        }

    async def _generate_section(self,
                              section: str,
                              task: Dict[str, Any],
                              parameters: ReportParameters,
                              template: ReportTemplate) -> Dict[str, Any]:
        """Generate a specific section of the report"""
        # Get section-specific patterns
        patterns = await self.learning_core.get_patterns(
            event_type=f"report_section_{section}",
            min_confidence=0.8
        )
        
        section_params = {
            'section': section,
            'template': template.dict(),
            'data_sources': parameters.data_sources,
            'format': parameters.target_format
        }
        
        # Apply section-specific optimizations
        if patterns:
            pattern_id, pattern = patterns[0]
            section_params = await self.learning_core.apply_pattern(
                pattern_id,
                section_params
            )
        
        # Generate section content
        content = await self._generate_section_content(section_params)
        
        return {
            'content': content,
            'metadata': {
                'generated_at': datetime.utcnow().isoformat(),
                'optimizations_applied': bool(patterns)
            }
        }

    async def _generate_section_content(self, params: Dict[str, Any]) -> Any:
        """Generate content for a specific section"""
        # Implementation depends on section type
        raise NotImplementedError()

    async def _record_report_completion(self,
                                     session_id: UUID,
                                     success: bool,
                                     result: Optional[Dict[str, Any]] = None,
                                     error: Optional[str] = None) -> None:
        """Record report completion for learning purposes"""
        if session_id in self._report_history:
            history = self._report_history[session_id]
            duration = (datetime.utcnow() - history['start_time']).total_seconds()
            
            # Record learning event
            await self.learning_core.record_event(
                event_type=f"report_{history['parameters']['report_type']}",
                context_id=session_id,
                data={
                    'parameters': history['parameters'],
                    'template': history['template'],
                    'optimizations': history['optimizations_applied'],
                    'duration': duration
                },
                outcome={
                    'success': success,
                    'error': error if error else None,
                    'summary': self._summarize_result(result) if result else None
                }
            )
            
            del self._report_history[session_id]

    def _summarize_result(self, result: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Create a summary of the report generation result"""
        if not result:
            return {}
            
        return {
            'sections_generated': list(result.get('sections', {}).keys()),
            'optimizations_applied': result.get('metadata', {}).get('optimizations', []),
            'generation_timestamp': result.get('metadata', {}).get('generated_at')
        }

    async def register_template(self, template: ReportTemplate) -> None:
        """Register a new report template"""
        self._templates[template.template_id] = template

    async def get_report_insights(self, 
                                report_type: Optional[str] = None) -> Dict[str, Any]:
        """Get insights about report generation patterns and performance"""
        insights = await super().get_learning_insights()
        
        # Get report-specific patterns
        patterns = await self.learning_core.get_patterns(
            event_type=f"report_{report_type}" if report_type else "report"
        )
        
        # Calculate performance metrics
        performance = self._calculate_report_performance(patterns)
        
        insights.update({
            'templates_available': len(self._templates),
            'report_patterns': len(patterns),
            'performance_metrics': performance
        })
        
        return insights

    def _calculate_report_performance(self, 
                                    patterns: List[Tuple[UUID, LearningPattern]]) -> Dict[str, Any]:
        """Calculate report generation performance metrics"""
        if not patterns:
            return {'status': 'insufficient_data'}
            
        successful_patterns = [
            p for _, p in patterns 
            if p.metadata.get('success_rate', 0) >= 0.8
        ]
        
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
            'optimization_coverage': len(duration_improvements) / len(patterns)
        }