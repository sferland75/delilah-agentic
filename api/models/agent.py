from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime
import uuid
from .state import AgentState, AgentCapability, AgentStateManager

class AgentBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    type: str = Field(..., min_length=1)
    state_manager: AgentStateManager = Field(default_factory=AgentStateManager)
    active: bool = True

class AgentCreate(AgentBase):
    capabilities: Optional[List[AgentCapability]] = None

    def prepare_state_manager(self) -> None:
        if self.capabilities:
            for capability in self.capabilities:
                self.state_manager.add_capability(capability)

class AgentUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    new_state: Optional[AgentState] = None
    state_transition_reason: Optional[str] = None
    capabilities_to_add: Optional[List[AgentCapability]] = None
    capabilities_to_remove: Optional[List[AgentCapability]] = None
    active: Optional[bool] = None

class AgentResponse(AgentBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime]
    
    model_config = ConfigDict(from_attributes=True)