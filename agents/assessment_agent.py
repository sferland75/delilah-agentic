from typing import Dict, Any, Optional
from datetime import datetime
from uuid import UUID
from .base import AgentType, AgentStatus, AgentContext
from .agent_learning import LearningEnabledAgent
from pydantic import BaseModel, Field

class AssessmentParameters(BaseModel):
    """Parameters for assessment tasks"""
    assessment_type: str
    protocol_version: str
    client_age: int = Field(ge=0, le=150)
    assessment_area: str
    custom_parameters: Optional[Dict[str, Any]] = None

class LearningAssessmentAgent(LearningEnabledAgent):
    """Assessment agent with learning capabilities for OT assessments"""
    
    def __init__(self, name: str):
        super().__init__(
            agent_type=AgentType.ASSESSMENT,
            name=name,
        )
        self.supported_assessments = set()
        self._assessment_history: Dict[UUID, Dict[str, Any]] = {}

    async def process_task(self, task: Dict[str, Any], context: AgentContext) -> Dict[str, Any]:
        """Process an assessment task with learning enhancement"""
        # Validate assessment parameters
        parameters = AssessmentParameters(**task.get('parameters', {}))
        
        # Record assessment start
        self._assessment_history[context.session_id] = {
            'start_time': datetime.utcnow(),
            'parameters': parameters.dict(),
            'steps_completed': []
        }
        
        try:
            # Get relevant learning patterns
            patterns = await self.learning_core.get_patterns(
                event_type=f"assessment_{parameters.assessment_type}",
                min_confidence=0.8
            )
            
            # Apply learned optimizations if available
            if patterns:
                pattern_id, pattern = patterns[0]
                task = await self.learning_core.apply_pattern(pattern_id, task)
            
            # Process assessment steps
            result = await self._execute_assessment_steps(task, context, parameters)
            
            # Record successful completion
            await self._record_assessment_completion(context.session_id, True, result)
            
            return result
            
        except Exception as e:
            # Record failed completion
            await self._record_assessment_completion(context.session_id, False, error=str(e))
            raise

    async def _execute_assessment_steps(self, 
                                      task: Dict[str, Any],
                                      context: AgentContext,
                                      parameters: AssessmentParameters) -> Dict[str, Any]:
        """Execute individual assessment steps with learning optimization"""
        assessment_steps = self._get_assessment_protocol(parameters.assessment_type,
                                                       parameters.protocol_version)
        
        results = {}
        for step in assessment_steps:
            step_result = await self._execute_single_step(step, context, parameters)
            results[step['id']] = step_result
            
            # Record step completion for learning
            self._assessment_history[context.session_id]['steps_completed'].append({
                'step_id': step['id'],
                'duration': step_result.get('duration'),
                'success': step_result.get('success', False)
            })
            
            # Learn from step execution
            await self.learning_core.record_event(
                event_type=f"assessment_step_{step['id']}",
                context_id=context.session_id,
                data={
                    'step': step,
                    'parameters': parameters.dict(),
                    'previous_results': results
                },
                outcome={
                    'success': step_result.get('success', False),
                    'duration': step_result.get('duration'),
                    'result': step_result
                }
            )
        
        return {
            'assessment_type': parameters.assessment_type,
            'protocol_version': parameters.protocol_version,
            'steps': results,
            'summary': self._generate_assessment_summary(results, parameters)
        }

    async def _record_assessment_completion(self,
                                          session_id: UUID,
                                          success: bool,
                                          result: Optional[Dict[str, Any]] = None,
                                          error: Optional[str] = None) -> None:
        """Record assessment completion for learning purposes"""
        if session_id in self._assessment_history:
            history = self._assessment_history[session_id]
            duration = (datetime.utcnow() - history['start_time']).total_seconds()
            
            await self.learning_core.record_event(
                event_type=f"assessment_{history['parameters']['assessment_type']}",
                context_id=session_id,
                data={
                    'parameters': history['parameters'],
                    'steps_completed': history['steps_completed'],
                    'duration': duration
                },
                outcome={
                    'success': success,
                    'error': error if error else None,
                    'result': result if result else None
                }
            )
            
            del self._assessment_history[session_id]

    def _get_assessment_protocol(self, assessment_type: str, version: str) -> List[Dict[str, Any]]:
        """Retrieve assessment protocol steps (implemented by specific assessment types)"""
        raise NotImplementedError("Must be implemented by specific assessment types")

    async def _execute_single_step(self,
                                 step: Dict[str, Any],
                                 context: AgentContext,
                                 parameters: AssessmentParameters) -> Dict[str, Any]:
        """Execute a single assessment step (implemented by specific assessment types)"""
        raise NotImplementedError("Must be implemented by specific assessment types")

    def _generate_assessment_summary(self,
                                   step_results: Dict[str, Any],
                                   parameters: AssessmentParameters) -> Dict[str, Any]:
        """Generate assessment summary (implemented by specific assessment types)"""
        raise NotImplementedError("Must be implemented by specific assessment types")

    async def get_assessment_insights(self, 
                                    assessment_type: Optional[str] = None) -> Dict[str, Any]:
        """Get learning insights specific to assessments"""
        patterns = await self.learning_core.get_patterns(
            event_type=f"assessment_{assessment_type}" if assessment_type else "assessment"
        )
        
        insights = await super().get_learning_insights()
        insights.update({
            'assessment_patterns': len(patterns),
            'optimized_steps': [
                p.metadata.get('common_factors', {}).get('step_id')
                for _, p in patterns
                if p.confidence >= 0.9
            ],
            'success_rate': sum(1 for _, p in patterns if 
                             p.metadata.get('success_rate', 0) >= 0.8) / len(patterns) if patterns else 0
        })
        
        return insights