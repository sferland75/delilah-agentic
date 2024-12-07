from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List
from uuid import UUID
import asyncio
import json

@dataclass
class AssessmentRecord:
    session_id: UUID
    client_id: UUID
    therapist_id: UUID
    assessment_type: str
    responses: Dict
    start_time: datetime
    end_time: datetime

class DocumentationAgent:
    def __init__(self):
        self.message_queue = asyncio.Queue()
        self.records: Dict[UUID, AssessmentRecord] = {}
    
    async def process_message(self, message: Dict):
        """Process incoming messages from other agents"""
        if message['type'] == 'assessment_started':
            await self.start_record(message)
        elif message['type'] == 'step_completed':
            await self.update_record(message)
        elif message['type'] == 'assessment_completed':
            await self.finalize_record(message)
    
    async def start_record(self, message: Dict):
        """Initialize a new assessment record"""
        record = AssessmentRecord(
            session_id=message['session_id'],
            client_id=message['client_id'],
            therapist_id=message['therapist_id'],
            assessment_type=message['assessment_type'],
            responses={},
            start_time=datetime.now(),
            end_time=None
        )
        self.records[record.session_id] = record
    
    async def update_record(self, message: Dict):
        """Update record with new step data"""
        record = self.records.get(message['session_id'])
        if record:
            record.responses[message['step_id']] = message['response']
    
    async def finalize_record(self, message: Dict):
        """Complete the assessment record and notify Analysis Agent"""
        record = self.records.get(message['session_id'])
        if record:
            record.end_time = datetime.now()
            await self.message_queue.put({
                'type': 'documentation_complete',
                'session_id': record.session_id,
                'record': record
            })
    
    async def get_record(self, session_id: UUID) -> AssessmentRecord:
        """Retrieve a specific assessment record"""
        return self.records.get(session_id)
