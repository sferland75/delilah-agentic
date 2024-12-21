from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List
from uuid import UUID
import asyncio

@dataclass
class Report:
    session_id: UUID
    client_id: UUID
    therapist_id: UUID
    assessment_type: str
    summary: str
    independence_levels: Dict[str, str]
    key_concerns: List[str]
    recommendations: List[str]
    generated_at: datetime
    status: str = 'draft'

class ReportAgent:
    def __init__(self):
        self.message_queue = asyncio.Queue()
        self.reports: Dict[UUID, Report] = {}
    
    async def process_analysis(self, message: Dict):
        """Process completed analysis and generate report"""
        if message['type'] != 'analysis_complete':
            return
            
        analysis = message['analysis']
        record = await self._get_record(analysis.session_id)
        
        report = await self.generate_report(record, analysis)
        self.reports[analysis.session_id] = report
        
        await self.message_queue.put({
            'type': 'report_generated',
            'session_id': analysis.session_id,
            'report': report
        })
    
    async def generate_report(self, record, analysis) -> Report:
        """Generate structured report from analysis results"""
        summary = self._generate_summary(record, analysis)
        
        return Report(
            session_id=record.session_id,
            client_id=record.client_id,
            therapist_id=record.therapist_id,
            assessment_type=record.assessment_type,
            summary=summary,
            independence_levels=analysis.independence_levels,
            key_concerns=analysis.key_concerns,
            recommendations=analysis.recommendations,
            generated_at=datetime.now()
        )
    
    def _generate_summary(self, record, analysis) -> str:
        """Generate natural language summary of assessment"""
        concerns_text = '\n- '.join(analysis.key_concerns) if analysis.key_concerns else 'No major concerns identified'
        recommendations_text = '\n- '.join(analysis.recommendations)
        
        summary = f"""Assessment Summary

Type: {record.assessment_type}
Date: {record.start_time.strftime('%Y-%m-%d')}

Key Findings:
- {concerns_text}

Recommendations:
- {recommendations_text}
"""
        
        return summary
    
    async def approve_report(self, session_id: UUID):
        """Mark report as approved"""
        if report := self.reports.get(session_id):
            report.status = 'approved'
            await self.message_queue.put({
                'type': 'report_approved',
                'session_id': session_id
            })
    
    async def get_report(self, session_id: UUID) -> Report:
        """Retrieve generated report"""
        return self.reports.get(session_id)
    
    async def _get_record(self, session_id: UUID):
        """Placeholder for getting record from Documentation Agent"""
        # In real implementation, would communicate with Documentation Agent
        pass