from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field, validator
from enum import Enum
from .base import TimestampedModel

class AgentType(str, Enum):
    ASSESSMENT = "assessment"
    ANALYSIS = "analysis"
    DOCUMENTATION = "documentation"
    REPORT = "report"
    CLIENT_MANAGER = "client_manager"
    THERAPIST_MANAGER = "therapist_manager"
    USER_MANAGER = "user_manager"
    EXPORT_MANAGER = "export_manager"

class AgentStatus(str, Enum):
    IDLE = "idle"
    BUSY = "busy"
    ERROR = "error"
    DISABLED = "disabled"

class AgentConfig(BaseModel):
    """Configuration settings for an agent instance"""
    max_concurrent_tasks: int = Field(default=1, ge=1, le=100)
    timeout_seconds: int = Field(default=300, ge=30, le=3600)
    retry_attempts: int = Field(default=3, ge=0, le=10)
    custom_settings: Optional[Dict[str, Any]] = None

    @validator("custom_settings")
    def validate_custom_settings(cls, v):
        if v is not None:
            reserved_keys = {"max_concurrent_tasks", "timeout_seconds", "retry_attempts"}
            if any(key in v for key in reserved_keys):
                raise ValueError(f"Custom settings cannot contain reserved keys: {reserved_keys}")
        return v

class AgentBase(TimestampedModel):
    """Base model for agent configuration and validation"""
    id: UUID
    type: AgentType
    name: str = Field(..., min_length=3, max_length=50)
    description: Optional[str] = Field(None, max_length=500)
    version: str = Field(..., pattern=r"^\d+\.\d+\.\d+$")
    status: AgentStatus = Field(default=AgentStatus.IDLE)
    config: AgentConfig
    last_active: Optional[datetime] = None
    error_count: int = Field(default=0, ge=0)
    metadata: Optional[Dict[str, Any]] = None

    @validator("name")
    def validate_name(cls, v):
        if not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError("Name must contain only alphanumeric characters, underscores, and hyphens")
        return v

    @validator("version")
    def validate_version(cls, v):
        major, minor, patch = map(int, v.split("."))
        if any(x < 0 for x in (major, minor, patch)):
            raise ValueError("Version components must be non-negative")
        return v

class AgentCreate(BaseModel):
    """Model for creating a new agent"""
    type: AgentType
    name: str = Field(..., min_length=3, max_length=50)
    description: Optional[str] = Field(None, max_length=500)
    version: str = Field(..., pattern=r"^\d+\.\d+\.\d+$")
    config: AgentConfig
    metadata: Optional[Dict[str, Any]] = None

class AgentUpdate(BaseModel):
    """Model for updating an existing agent"""
    name: Optional[str] = Field(None, min_length=3, max_length=50)
    description: Optional[str] = Field(None, max_length=500)
    version: Optional[str] = Field(None, pattern=r"^\d+\.\d+\.\d+$")
    status: Optional[AgentStatus] = None
    config: Optional[AgentConfig] = None
    metadata: Optional[Dict[str, Any]] = None