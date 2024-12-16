from enum import Enum
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class AgentState(str, Enum):
    IDLE = "idle"
    READY = "ready"
    BUSY = "busy"
    ERROR = "error"
    PAUSED = "paused"

class AgentCapability(str, Enum):
    CHAT = "chat"
    TASK_EXECUTION = "task_execution"
    DATA_ANALYSIS = "data_analysis"
    AGENT_MANAGEMENT = "agent_management"
    TASK_DISTRIBUTION = "task_distribution"
    INITIAL_ASSESSMENT = "initial_assessment"
    PROGRESS_TRACKING = "progress_tracking"
    REPORT_GENERATION = "report_generation"

class StateTransition(BaseModel):
    from_state: AgentState
    to_state: AgentState
    timestamp: datetime = Field(default_factory=lambda: datetime.now())
    reason: Optional[str] = None

class AgentStateManager(BaseModel):
    current_state: AgentState = AgentState.IDLE
    capabilities: List[AgentCapability] = []
    metadata: Dict[str, Any] = Field(default_factory=dict)
    state_history: List[StateTransition] = Field(default_factory=list)

    def transition_to(self, new_state: AgentState, reason: Optional[str] = None) -> bool:
        # Define valid transitions
        valid_transitions = {
            AgentState.IDLE: [AgentState.READY, AgentState.ERROR],
            AgentState.READY: [AgentState.BUSY, AgentState.IDLE, AgentState.ERROR, AgentState.PAUSED],
            AgentState.BUSY: [AgentState.IDLE, AgentState.ERROR, AgentState.PAUSED],
            AgentState.ERROR: [AgentState.IDLE],
            AgentState.PAUSED: [AgentState.READY, AgentState.IDLE, AgentState.ERROR]
        }

        if new_state not in valid_transitions.get(self.current_state, []):
            return False

        transition = StateTransition(
            from_state=self.current_state,
            to_state=new_state,
            reason=reason
        )
        
        self.state_history.append(transition)
        self.current_state = new_state
        return True

    def add_capability(self, capability: AgentCapability) -> None:
        if capability not in self.capabilities:
            self.capabilities.append(capability)

    def remove_capability(self, capability: AgentCapability) -> bool:
        if capability in self.capabilities:
            self.capabilities.remove(capability)
            return True
        return False

    def has_capability(self, capability: AgentCapability) -> bool:
        return capability in self.capabilities