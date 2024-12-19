from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional
import json
import asyncio
from uuid import UUID, uuid4

class AssessmentType(Enum):
    ADL = "Activities of Daily Living"
    IADL = "Instrumental Activities of Daily Living"
    COGNITIVE = "Cognitive Assessment"
    PHYSICAL = "Physical Assessment"
    SENSORY = "Sensory Assessment"

@dataclass
class AssessmentStep:
    id: str
    question: str
    input_type: str  # 'scale', 'text', 'multiselect', 'number'
    options: Optional[List[str]] = None
    validation: Optional[Dict] = None
    required: bool = True

class AssessmentProtocol:
    def __init__(self, assessment_type: AssessmentType):
        self.type = assessment_type
        self.steps = self._load_protocol()
    
    def _load_protocol(self) -> List[AssessmentStep]:
        if self.type == AssessmentType.ADL:
            return [
                AssessmentStep(
                    id="bathing",
                    question="Rate client's bathing independence",
                    input_type="scale",
                    options=["Independent", "Supervision", "Minimal Assist", "Moderate Assist", "Maximum Assist"],
                    validation={"required": True}
                ),
                AssessmentStep(
                    id="bathing_notes",
                    question="Specific observations during bathing assessment",
                    input_type="text",
                    validation={"min_length": 10}
                )
            ]
        return []

class AssessmentAgent:
    def __init__(self):
        self.active_sessions: Dict[UUID, AssessmentSession] = {}
        self.message_queue = asyncio.Queue()
    
    async def start_assessment(self, client_id: UUID, therapist_id: UUID, assessment_type: AssessmentType) -> UUID:
        session = AssessmentSession(client_id, therapist_id, assessment_type)
        self.active_sessions[session.session_id] = session
        
        await self.message_queue.put({
            "type": "assessment_started",
            "session_id": session.session_id,
            "client_id": client_id,
            "assessment_type": assessment_type.value
        })
        
        return session.session_id

    async def get_next_step(self, session_id: UUID) -> Optional[AssessmentStep]:
        session = self.active_sessions.get(session_id)
        if not session or session.current_step >= len(session.protocol.steps):
            return None
        
        return session.protocol.steps[session.current_step]
