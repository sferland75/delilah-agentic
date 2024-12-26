from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Dict, Any, Optional

class AgentState(BaseModel):
    agent_id: str
    session_id: UUID4
    state: Dict[str, Any]
    created_at: datetime
    updated_at: datetime

class AgentStateManager:
    def __init__(self):
        self.states: Dict[str, Dict[UUID4, AgentState]] = {}
    
    def set_state(self, agent_id: str, session_id: UUID4, state: Dict[str, Any]) -> None:
        if agent_id not in self.states:
            self.states[agent_id] = {}
        
        self.states[agent_id][session_id] = AgentState(
            agent_id=agent_id,
            session_id=session_id,
            state=state,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
    
    def get_state(self, agent_id: str, session_id: UUID4) -> Optional[Dict[str, Any]]:
        if agent_id in self.states and session_id in self.states[agent_id]:
            return self.states[agent_id][session_id].state
        return None
    
    def update_state(self, agent_id: str, session_id: UUID4, state: Dict[str, Any]) -> None:
        if agent_id in self.states and session_id in self.states[agent_id]:
            current_state = self.states[agent_id][session_id]
            current_state.state.update(state)
            current_state.updated_at = datetime.utcnow()