from enum import Enum
from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from uuid import UUID, uuid4
import json

class AgentStatus(Enum):
    IDLE = "idle"
    BUSY = "busy"
    ERROR = "error"
    DISABLED = "disabled"
    INITIALIZING = "initializing"
    SHUTTING_DOWN = "shutting_down"

class StateTransitionError(Exception):
    """Raised when an invalid state transition is attempted"""
    pass

class AgentState(BaseModel):
    agent_id: UUID = Field(default_factory=uuid4)
    status: AgentStatus
    last_active: datetime = Field(default_factory=datetime.utcnow)
    error_count: int = Field(default=0)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    version: int = Field(default=1)
    history: List[Dict[str, Any]] = Field(default_factory=list)

    def update_status(self, new_status: AgentStatus, metadata: Optional[Dict] = None):
        """Update state with transition validation and history tracking"""
        if not self._is_valid_transition(new_status):
            raise StateTransitionError(f"Invalid transition from {self.status} to {new_status}")
        
        # Record current state in history
        self.history.append({
            "timestamp": datetime.utcnow().isoformat(),
            "from_status": self.status.value,
            "to_status": new_status.value,
            "metadata": self.metadata.copy()
        })
        
        # Update state
        self.status = new_status
        self.last_active = datetime.utcnow()
        if metadata:
            self.metadata.update(metadata)

    def _is_valid_transition(self, new_status: AgentStatus) -> bool:
        """Validate state transitions based on business rules"""
        # Define valid transitions
        valid_transitions = {
            AgentStatus.IDLE: [AgentStatus.BUSY, AgentStatus.DISABLED, AgentStatus.ERROR],
            AgentStatus.BUSY: [AgentStatus.IDLE, AgentStatus.ERROR, AgentStatus.DISABLED],
            AgentStatus.ERROR: [AgentStatus.IDLE, AgentStatus.DISABLED],
            AgentStatus.DISABLED: [AgentStatus.INITIALIZING],
            AgentStatus.INITIALIZING: [AgentStatus.IDLE, AgentStatus.ERROR],
            AgentStatus.SHUTTING_DOWN: [AgentStatus.DISABLED]
        }
        
        return new_status in valid_transitions.get(self.status, [])

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            UUID: lambda v: str(v)
        }

class AgentStateManager:
    def __init__(self, persistence_path: Optional[str] = None):
        self.states: Dict[UUID, AgentState] = {}
        self.persistence_path = persistence_path
        if persistence_path:
            self.load_states()
    
    def update_state(self, agent_id: UUID, status: AgentStatus, metadata: Optional[Dict] = None):
        """Update agent state with validation and persistence"""
        try:
            if agent_id in self.states:
                state = self.states[agent_id]
                state.update_status(status, metadata)
            else:
                state = AgentState(
                    agent_id=agent_id,
                    status=status,
                    metadata=metadata or {}
                )
                self.states[agent_id] = state
            
            if self.persistence_path:
                self.save_states()
                
        except StateTransitionError as e:
            # Log the error and possibly notify monitoring system
            raise
    
    def get_state(self, agent_id: UUID) -> Optional[AgentState]:
        """Retrieve current state for an agent"""
        return self.states.get(agent_id)

    def get_all_states(self) -> Dict[UUID, AgentState]:
        """Get all agent states"""
        return self.states.copy()

    def increment_error(self, agent_id: UUID):
        """Increment error count and update status if needed"""
        if agent_id in self.states:
            state = self.states[agent_id]
            state.error_count += 1
            if state.error_count >= 3:  # Configurable threshold
                state.update_status(AgentStatus.ERROR, {"reason": "Error threshold exceeded"})
            if self.persistence_path:
                self.save_states()

    def save_states(self):
        """Persist states to file"""
        if not self.persistence_path:
            return
        
        states_dict = {
            str(agent_id): {
                **state.dict(),
                "status": state.status.value
            }
            for agent_id, state in self.states.items()
        }
        
        with open(self.persistence_path, 'w') as f:
            json.dump(states_dict, f, indent=2)

    def load_states(self):
        """Load states from persistence file"""
        if not self.persistence_path:
            return
            
        try:
            with open(self.persistence_path, 'r') as f:
                states_dict = json.load(f)
                
            for agent_id_str, state_dict in states_dict.items():
                # Convert string status back to enum
                state_dict['status'] = AgentStatus(state_dict['status'])
                # Convert string agent_id back to UUID
                state_dict['agent_id'] = UUID(agent_id_str)
                # Parse ISO format datetime strings
                state_dict['last_active'] = datetime.fromisoformat(state_dict['last_active'])
                
                self.states[UUID(agent_id_str)] = AgentState(**state_dict)
        except FileNotFoundError:
            # No persistence file yet, start with empty state
            pass