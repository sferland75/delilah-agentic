from enum import Enum
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class AgentStateStatus(str, Enum):
    INITIALIZING = "initializing"
    READY = "ready"
    PROCESSING = "processing"
    PAUSED = "paused"
    ERROR = "error"
    COMPLETED = "completed"

class AgentState(BaseModel):
    status: AgentStateStatus
    progress: Optional[float] = Field(None, ge=0, le=100)
    last_updated: Optional[str] = None
    error_message: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)

    class Config:
        use_enum_values = True

# Valid state transitions
STATE_TRANSITIONS = {
    AgentStateStatus.INITIALIZING: [AgentStateStatus.READY, AgentStateStatus.ERROR],
    AgentStateStatus.READY: [AgentStateStatus.PROCESSING, AgentStateStatus.ERROR],
    AgentStateStatus.PROCESSING: [AgentStateStatus.PAUSED, AgentStateStatus.COMPLETED, AgentStateStatus.ERROR],
    AgentStateStatus.PAUSED: [AgentStateStatus.PROCESSING, AgentStateStatus.ERROR],
    AgentStateStatus.ERROR: [AgentStateStatus.READY],
    AgentStateStatus.COMPLETED: [AgentStateStatus.READY]
}