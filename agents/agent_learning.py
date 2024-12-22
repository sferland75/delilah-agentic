from typing import Dict, Any, Optional, List
from uuid import UUID
from datetime import datetime
from .base import BaseAgent, AgentContext, AgentStatus
from .learning_core import AgentLearningCore

class LearningEnabledAgent(BaseAgent):
    """Extension of BaseAgent with learning capabilities"""
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.learning_core = AgentLearningCore()
        self._session_data: Dict[UUID, Dict[str, Any]] = {}

    async def start_session(self, context: AgentContext) -> UUID:
        """Start session with learning initialization"""
        session_id = await super().start_session(context)
        
        # Initialize session data tracking
        self._session_data[session_id] = {
            'start_time': datetime.utcnow(),
            'events': [],
            'patterns_applied': []
        }
        
        return session_id

    async def end_session(self, session_id: UUID) -> None:
        """End session with learning finalization"""
        if session_id in self._session_data:
            session_stats = self._calculate_session_stats(session_id)
            
            # Record session as learning event
            await self.learning_core.record_event(
                event_type='session_completion',
                context_id=session_id,
                data={
                    'session_duration': session_stats['duration'],
                    'event_count': session_stats['event_count'],
                    'patterns_applied': session_stats['patterns_applied']
                },
                outcome={
                    'success': session_stats['success'],
                    'error_count': session_stats['error_count']
                }
            )
            
            del self._session_data[session_id]
        
        await super().end_session(session_id)

    def _calculate_session_stats(self, session_id: UUID) -> Dict[str, Any]:
        """Calculate statistics for a session"""
        session = self._session_data[session_id]
        duration = (datetime.utcnow() - session['start_time']).total_seconds()
        
        return {
            'duration': duration,
            'event_count': len(session['events']),
            'patterns_applied': session['patterns_applied'],
            'success': any(e['type'] == 'success' for e in session['events']),
            'error_count': sum(1 for e in session['events'] if e['type'] == 'error')
        }

    async def process_task(self, task: Dict[str, Any], context: AgentContext) -> Dict[str, Any]:
        """Process task with learning enhancement"""
        try:
            # Get relevant patterns
            patterns = await self.learning_core.get_patterns(
                event_type=task.get('type'),
                min_confidence=0.8
            )
            
            enhanced_task = task
            # Apply most confident relevant pattern if available
            if patterns:
                pattern_id, pattern = patterns[0]
                enhanced_task = await self.learning_core.apply_pattern(pattern_id, task)
                self._session_data[context.session_id]['patterns_applied'].append(str(pattern_id))
            
            # Process the enhanced task
            start_time = datetime.utcnow()
            result = await super().process_task(enhanced_task, context)
            duration = (datetime.utcnow() - start_time).total_seconds()
            
            # Record successful execution
            self._session_data[context.session_id]['events'].append({
                'type': 'success',
                'task_type': task.get('type'),
                'duration': duration,
                'timestamp': datetime.utcnow()
            })
            
            # Learn from successful execution
            await self.learning_core.record_event(
                event_type=f"task_{task.get('type', 'unknown')}",
                context_id=context.session_id,
                data=enhanced_task,
                outcome={
                    'success': True,
                    'duration': duration,
                    'result': result
                }
            )
            
            return result
            
        except Exception as e:
            # Record error event
            self._session_data[context.session_id]['events'].append({
                'type': 'error',
                'error': str(e),
                'timestamp': datetime.utcnow()
            })
            
            # Learn from failure
            await self.learning_core.record_event(
                event_type=f"task_{task.get('type', 'unknown')}_error",
                context_id=context.session_id,
                data=task,
                outcome={
                    'success': False,
                    'error': str(e)
                }
            )
            
            raise

    async def get_learning_insights(self, session_id: Optional[UUID] = None) -> Dict[str, Any]:
        """Get learning insights for the agent or specific session"""
        patterns = await self.learning_core.get_patterns()
        
        insights = {
            'total_patterns_identified': len(patterns),
            'high_confidence_patterns': sum(1 for _, p in patterns if p.confidence >= 0.9),
            'pattern_types': list(set(p.pattern_type for _, p in patterns))
        }
        
        if session_id and session_id in self._session_data:
            insights['session_stats'] = self._calculate_session_stats(session_id)
        
        return insights