from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from uuid import UUID, uuid4

@dataclass
class Client:
    id: UUID
    first_name: str
    last_name: str
    date_of_birth: datetime
    contact_info: Dict
    created_at: datetime
    assessments: List[UUID] = None
    status: str = 'active'  # active, discharged, on_hold
    assigned_therapist: UUID = None
    program: str = None

class ClientManager:
    def __init__(self):
        self.clients: Dict[UUID, Client] = {}
        self.client_assessments: Dict[UUID, List[UUID]] = {}

    async def bulk_update_status(self, client_ids: List[UUID], new_status: str) -> List[Client]:
        updated = []
        for client_id in client_ids:
            if client := self.clients.get(client_id):
                client.status = new_status
                updated.append(client)
        return updated

    async def bulk_assign_therapist(self, client_ids: List[UUID], therapist_id: UUID) -> List[Client]:
        updated = []
        for client_id in client_ids:
            if client := self.clients.get(client_id):
                client.assigned_therapist = therapist_id
                updated.append(client)
        return updated

    async def bulk_assign_program(self, client_ids: List[UUID], program: str) -> List[Client]:
        updated = []
        for client_id in client_ids:
            if client := self.clients.get(client_id):
                client.program = program
                updated.append(client)
        return updated

    async def bulk_start_assessments(self, client_ids: List[UUID], assessment_type: str) -> List[UUID]:
        session_ids = []
        for client_id in client_ids:
            if client := self.clients.get(client_id):
                session_id = uuid4()  # In real implementation, this would create actual assessment
                if not client.assessments:
                    client.assessments = []
                client.assessments.append(session_id)
                session_ids.append(session_id)
        return session_ids