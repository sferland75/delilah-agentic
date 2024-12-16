from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime
import uuid

class AgentBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    type: str = Field(..., min_length=1)
    state: Dict[str, Any] = Field(default_factory=dict)
    active: bool = True

class AgentCreate(AgentBase):
    pass

class AgentUpdate(AgentBase):
    name: Optional[str] = None
    type: Optional[str] = None
    state: Optional[Dict[str, Any]] = None
    active: Optional[bool] = None

class AgentResponse(AgentBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime]
    
    model_config = ConfigDict(from_attributes=True)