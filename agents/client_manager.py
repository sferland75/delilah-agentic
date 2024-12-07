from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Optional
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

class ClientManager:
    def __init__(self):
        self.clients: Dict[UUID, Client] = {}
        self.client_assessments: Dict[UUID, List[UUID]] = {}
    
    async def create_client(self, first_name: str, last_name: str, 
                          date_of_birth: datetime, contact_info: Dict) -> Client:
        client_id = uuid4()
        client = Client(
            id=client_id,
            first_name=first_name,
            last_name=last_name,
            date_of_birth=date_of_birth,
            contact_info=contact_info,
            created_at=datetime.now(),
            assessments=[]
        )
        self.clients[client_id] = client
        self.client_assessments[client_id] = []
        return client
    
    async def search_clients(self, query: str = None) -> List[Client]:
        if not query:
            return list(self.clients.values())
            
        query = query.lower()
        return [
            client for client in self.clients.values()
            if query in client.first_name.lower() or
               query in client.last_name.lower() or
               query in client.contact_info.get('email', '').lower() or
               query in client.contact_info.get('phone', '')
        ]
    
    async def get_client(self, client_id: UUID) -> Optional[Client]:
        return self.clients.get(client_id)
    
    async def list_clients(self) -> List[Client]:
        return list(self.clients.values())
    
    async def add_assessment(self, client_id: UUID, session_id: UUID):
        if client := self.clients.get(client_id):
            self.client_assessments[client_id].append(session_id)
            client.assessments = self.client_assessments[client_id]
    
    async def get_client_assessments(self, client_id: UUID) -> List[UUID]:
        return self.client_assessments.get(client_id, [])