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
    
    async def search_clients(self, query: str = None, filters: Dict = None, sort_by: str = None) -> List[Client]:
        clients = list(self.clients.values())
        
        # Apply search
        if query:
            query = query.lower()
            clients = [
                client for client in clients
                if query in client.first_name.lower() or
                   query in client.last_name.lower() or
                   query in client.contact_info.get('email', '').lower() or
                   query in client.contact_info.get('phone', '')
            ]
        
        # Apply filters
        if filters:
            if filters.get('has_assessments'):
                clients = [c for c in clients if c.assessments and len(c.assessments) > 0]
            if filters.get('no_assessments'):
                clients = [c for c in clients if not c.assessments or len(c.assessments) == 0]
            if filters.get('date_range'):
                start = datetime.fromisoformat(filters['date_range']['start'])
                end = datetime.fromisoformat(filters['date_range']['end'])
                clients = [c for c in clients if start <= c.created_at <= end]
        
        # Apply sorting
        if sort_by:
            if sort_by == 'name':
                clients.sort(key=lambda x: f"{x.last_name} {x.first_name}".lower())
            elif sort_by == 'date':
                clients.sort(key=lambda x: x.created_at)
            elif sort_by == 'assessments':
                clients.sort(key=lambda x: len(x.assessments) if x.assessments else 0, reverse=True)
        
        return clients