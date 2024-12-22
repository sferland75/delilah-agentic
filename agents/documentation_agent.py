from typing import Dict, Any, Optional, List, Tuple
from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field
from .base import AgentType, AgentContext
from .agent_learning import LearningEnabledAgent

class DocumentationStructure(BaseModel):
    """Model for documentation structure"""
    structure_id: str
    sections: List[str]
    required_fields: List[str]
    optional_fields: List[str]
    templates: Dict[str, str]
    metadata: Dict[str, Any] = Field(default_factory=dict)

class DocumentationParameters(BaseModel):
    """Parameters for documentation generation"""
    doc_type: str
    structure_id: str
    data_sources: List[str]
    target_format: str = 'markdown'
    priority_fields: Optional[List[str]] = None
    custom_parameters: Optional[Dict[str, Any]] = None

class LearningDocumentationAgent(LearningEnabledAgent):
    """Documentation agent with learning capabilities"""
    
    def __init__(self, name: str):
        super().__init__(
            agent_type=AgentType.DOCUMENTATION,
            name=name
        )
        self._structures: Dict[str, DocumentationStructure] = {}
        self._doc_history: Dict[UUID, Dict[str, Any]] = {}

    async def process_task(self, task: Dict[str, Any], context: AgentContext) -> Dict[str, Any]:
        """Process a documentation task with learning optimization"""
        # Validate parameters
        parameters = DocumentationParameters(**task.get('parameters', {}))
        
        # Verify structure exists
        if parameters.structure_id not in self._structures:
            raise ValueError(f"Documentation structure {parameters.structure_id} not found")
        
        # Initialize documentation tracking
        self._doc_history[context.session_id] = {
            'start_time': datetime.utcnow(),
            'parameters': parameters.dict(),
            'structure': self._structures[parameters.structure_id].dict(),
            'optimizations_applied': []
        }
        
        try:
            # Get relevant learning patterns
            patterns = await self.learning_core.get_patterns(
                event_type=f"documentation_{parameters.doc_type}",
                min_confidence=0.8
            )
            
            # Apply learned optimizations
            optimized_task = task
            if patterns:
                pattern_id, pattern = patterns[0]
                optimized_task = await self.learning_core.apply_pattern(pattern_id, task)
                self._doc_history[context.session_id]['optimizations_applied'].append({
                    'pattern_id': str(pattern_id),
                    'confidence': pattern.confidence,
                    'timestamp': datetime.utcnow().isoformat()
                })
            
            # Generate documentation
            result = await self._generate_documentation(optimized_task, parameters)
            
            # Record successful completion
            await self._record_documentation_completion(context.session_id, True, result)
            
            return result
            
        except Exception as e:
            # Record failed completion
            await self._record_documentation_completion(
                context.session_id,
                False,
                error=str(e)
            )
            raise

    async def _generate_documentation(self,
                                    task: Dict[str, Any],
                                    parameters: DocumentationParameters) -> Dict[str, Any]:
        """Generate documentation using the specified structure and parameters"""
        structure = self._structures[parameters.structure_id]
        sections = structure.sections
        
        # Generate each section with potential optimizations
        content = {}
        for section in sections:
            section_content = await self._generate_section(
                section,
                task,
                parameters,
                structure
            )
            content[section] = section_content
        
        return {
            'doc_type': parameters.doc_type,
            'structure_id': parameters.structure_id,
            'content': content,
            'metadata': {
                'generated_at': datetime.utcnow().isoformat(),
                'format': parameters.target_format,
                'optimizations': self._doc_history[task['context_id']]['optimizations_applied']
            }
        }

    async def _generate_section(self,
                              section: str,
                              task: Dict[str, Any],
                              parameters: DocumentationParameters,
                              structure: DocumentationStructure) -> Dict[str, Any]:
        """Generate a specific section of the documentation"""
        # Get section-specific patterns
        patterns = await self.learning_core.get_patterns(
            event_type=f"documentation_section_{section}",
            min_confidence=0.8
        )
        
        section_params = {
            'section': section,
            'structure': structure.dict(),
            'data_sources': parameters.data_sources,
            'format': parameters.target_format,
            'template': structure.templates.get(section)
        }
        
        # Apply section-specific optimizations
        if patterns:
            pattern_id, pattern = patterns[0]
            section_params = await self.learning_core.apply_pattern(
                pattern_id,
                section_params
            )
        
        # Generate section content
        return await self._generate_section_content(section_params)

    async def _generate_section_content(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Generate content for a specific section"""
        raise NotImplementedError()

    async def _record_documentation_completion(self,
                                           session_id: UUID,
                                           success: bool,
                                           result: Optional[Dict[str, Any]] = None,
                                           error: Optional[str] = None) -> None:
        """Record documentation completion for learning purposes"""
        if session_id in self._doc_history:
            history = self._doc_history[session_id]
            duration = (datetime.utcnow() - history['start_time']).total_seconds()
            
            # Record learning event
            await self.learning_core.record_event(
                event_type=f"documentation_{history['parameters']['doc_type']}",
                context_id=session_id,
                data={
                    'parameters': history['parameters'],
                    'structure': history['structure'],
                    'optimizations': history['optimizations_applied'],
                    'duration': duration
                },
                outcome={
                    'success': success,
                    'error': error if error else None,
                    'summary': self._summarize_result(result) if result else None
                }
            )
            
            del self._doc_history[session_id]

    def _summarize_result(self, result: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Create a summary of the documentation generation result"""
        if not result:
            return {}
            
        return {
            'sections_generated': list(result.get('content', {}).keys()),
            'optimizations_applied': result.get('metadata', {}).get('optimizations', []),
            'generation_timestamp': result.get('metadata', {}).get('generated_at'),
            'format': result.get('metadata', {}).get('format')
        }

    async def register_structure(self, structure: DocumentationStructure) -> None:
        """Register a new documentation structure"""
        self._structures[structure.structure_id] = structure

    async def get_documentation_insights(self, 
                                       doc_type: Optional[str] = None) -> Dict[str, Any]:
        """Get insights about documentation generation patterns and performance"""
        insights = await super().get_learning_insights()
        
        # Get documentation-specific patterns
        patterns = await self.learning_core.get_patterns(
            event_type=f"documentation_{doc_type}" if doc_type else "documentation"
        )
        
        # Calculate optimization efficiency
        efficiency = self._calculate_optimization_efficiency(patterns)
        
        insights.update({
            'structures_available': len(self._structures),
            'documentation_patterns': len(patterns),
            'optimization_efficiency': efficiency
        })
        
        return insights

    def _calculate_optimization_efficiency(self, 
                                         patterns: List[Tuple[UUID, LearningPattern]]) -> Dict[str, Any]:
        """Calculate efficiency metrics for documentation optimizations"""
        if not patterns:
            return {'status': 'insufficient_data'}
            
        successful_patterns = [
            p for _, p in patterns 
            if p.metadata.get('success_rate', 0) >= 0.8
        ]
        
        if not successful_patterns:
            return {'status': 'no_successful_patterns'}
        
        # Calculate average improvements
        time_savings = []
        quality_improvements = []
        
        for pattern in successful_patterns:
            metadata = pattern.metadata
            if 'original_duration' in metadata and 'optimized_duration' in metadata:
                time_saving = (metadata['original_duration'] - metadata['optimized_duration']) \
                             / metadata['original_duration']
                time_savings.append(time_saving)
            
            if 'quality_score' in metadata and 'baseline_quality' in metadata:
                quality_improvement = (metadata['quality_score'] - metadata['baseline_quality']) \
                                     / metadata['baseline_quality']
                quality_improvements.append(quality_improvement)
        
        return {
            'status': 'active',
            'successful_patterns': len(successful_patterns),
            'avg_time_saving': sum(time_savings) / len(time_savings) if time_savings else 0,
            'avg_quality_improvement': sum(quality_improvements) / len(quality_improvements) \
                                     if quality_improvements else 0,
            'patterns_with_metrics': len(time_savings)
        }