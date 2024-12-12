from fastapi import APIRouter, Depends, HTTPException
from typing import List
from uuid import UUID

from ..models.assessment import AssessmentCreate, AssessmentStatus
from ..dependencies import get_coordinator
from coordinator import AgentCoordinator

router = APIRouter()

@router.post("/", response_model=UUID)
async def create_assessment(
    assessment: AssessmentCreate,
    coordinator: AgentCoordinator = Depends(get_coordinator)
):
    """Start a new assessment session"""
    try:
        session_id = await coordinator.start_assessment(
            client_id=assessment.client_id,
            therapist_id=assessment.therapist_id,
            assessment_type=assessment.assessment_type
        )
        return session_id
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{session_id}", response_model=AssessmentStatus)
async def get_assessment_status(
    session_id: UUID,
    coordinator: AgentCoordinator = Depends(get_coordinator)
):
    """Get current status of an assessment session"""
    try:
        status = await coordinator.get_session_status(session_id)
        return AssessmentStatus(**status)
    except ValueError:
        raise HTTPException(status_code=404, detail="Session not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))