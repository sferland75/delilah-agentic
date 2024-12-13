from fastapi import HTTPException
from typing import Dict, Any

from api.schemas.agent_state import AgentState, AgentStateStatus, STATE_TRANSITIONS

class AgentStateValidator:
    @staticmethod
    def validate_state(state: Dict[str, Any]) -> AgentState:
        """Validate agent state against schema"""
        try:
            return AgentState(**state)
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid agent state: {str(e)}"
            )
    
    @staticmethod
    def validate_transition(current_state: Dict[str, Any], new_state: Dict[str, Any]) -> None:
        """Validate state transition"""
        try:
            current = AgentState(**current_state)
            new = AgentState(**new_state)
            
            if new.status not in STATE_TRANSITIONS[current.status]:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid state transition from {current.status} to {new.status}"
                )
        except KeyError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid state transition: Unknown state {current.status}"
            )

    @staticmethod
    def validate_progress(state: Dict[str, Any]) -> None:
        """Validate progress field based on state"""
        validated_state = AgentState(**state)
        
        if validated_state.status == AgentStateStatus.PROCESSING and validated_state.progress is None:
            raise HTTPException(
                status_code=400,
                detail="Progress must be set when agent is in PROCESSING state"
            )

        if validated_state.status == AgentStateStatus.COMPLETED and (
            validated_state.progress is None or validated_state.progress != 100
        ):
            raise HTTPException(
                status_code=400,
                detail="Progress must be 100 when agent is in COMPLETED state"
            )