from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List
from uuid import UUID
import asyncio

@dataclass
class AnalysisResult:
    session_id: UUID
    independence_levels: Dict[str, str]
    key_concerns: List[str]
    recommendations: List[str]
    timestamp: datetime

class AnalysisAgent:
    def __init__(self):
        self.message_queue = asyncio.Queue()
        self.results: Dict[UUID, AnalysisResult] = {}
    
    async def process_documentation(self, message: Dict):
        """Process completed documentation from Documentation Agent"""
        if message['type'] != 'documentation_complete':
            return
            
        record = message['record']
        analysis = await self.analyze_assessment(record)
        
        await self.message_queue.put({
            'type': 'analysis_complete',
            'session_id': record.session_id,
            'analysis': analysis
        })
    
    async def analyze_assessment(self, record) -> AnalysisResult:
        """Analyze assessment data and generate insights"""
        independence_levels = {}
        key_concerns = []
        
        # Analyze independence levels
        for step_id, response in record.responses.items():
            if step_id in ['bathing', 'dressing']:
                independence_levels[step_id] = response
                if response in ['Moderate Assist', 'Maximum Assist']:
                    key_concerns.append(f'High assistance needed for {step_id}')
        
        # Generate recommendations
        recommendations = self._generate_recommendations(independence_levels, key_concerns)
        
        result = AnalysisResult(
            session_id=record.session_id,
            independence_levels=independence_levels,
            key_concerns=key_concerns,
            recommendations=recommendations,
            timestamp=datetime.now()
        )
        
        self.results[record.session_id] = result
        return result
    
    def _generate_recommendations(self, independence_levels: Dict, concerns: List) -> List[str]:
        """Generate recommendations based on analysis"""
        recommendations = []
        
        for activity, level in independence_levels.items():
            if level == 'Moderate Assist':
                recommendations.append(
                    f'Consider adaptive equipment for {activity}'
                )
            elif level == 'Maximum Assist':
                recommendations.append(
                    f'Develop detailed assistance protocol for {activity}'
                )
        
        if len(concerns) > 2:
            recommendations.append(
                'Recommend comprehensive care plan review'
            )
            
        return recommendations
    
    async def get_analysis(self, session_id: UUID) -> AnalysisResult:
        """Retrieve analysis results for a session"""
        return self.results.get(session_id)
