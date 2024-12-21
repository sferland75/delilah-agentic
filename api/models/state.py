from enum import Enum
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel
from uuid import UUID

class AgentStatus(Enum):
    IDLE = "idle"
    BUSY = "busy"
    ERROR = "error"
    DISABLED = "disabled"

class AgentState(BaseModel):
    agent_id: UUID
    status: AgentStatus
    last_active: datetime
    error_count: int = 0
    metadata: Optional[Dict[str, Any]] = None

class AgentStateManager:
    def __init__(self):
        self.states: Dict[UUID, AgentState] = {}
    
    def update_state(self, agent_id: UUID, status: AgentStatus, metadata: Optional[Dict] = None):
        if agent_id in self.states:
            state = self.states[agent_id]
            state.status = status
            state.last_active = datetime.utcnow()
            if metadata:
                state.metadata = metadata
        else:
            self.states[agent_id] = AgentState(
                agent_id=agent_id,
                status=status,
                last_active=datetime.utcnow(),
                metadata=metadata
            )
    
    def get_state(self, agent_id: UUID) -> Optional[AgentState]:
        return self.states.get(agent_id)

    def increment_error(self, agent_id: UUID):
        if agent_id in self.states:
            self.states[agent_id].error_count += 1