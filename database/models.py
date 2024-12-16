from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, JSON, Boolean, DateTime
from datetime import datetime, UTC
import uuid
from api.models.state import AgentStateManager, AgentState
from typing import Optional

class Base(DeclarativeBase):
    pass

class Agent(Base):
    __tablename__ = "agents"
    
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(50))
    type: Mapped[str] = mapped_column(String(50))
    state_manager: Mapped[dict] = mapped_column(JSON, default=lambda: AgentStateManager().model_dump())
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=lambda: datetime.now(UTC)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        nullable=True, 
        onupdate=lambda: datetime.now(UTC)
    )

    def transition_state(self, new_state: AgentState, reason: Optional[str] = None) -> bool:
        state_manager = AgentStateManager.model_validate(self.state_manager)
        success = state_manager.transition_to(new_state, reason)
        if success:
            self.state_manager = state_manager.model_dump()
        return success