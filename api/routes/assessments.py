from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from uuid import UUID

from ..models.assessment import AssessmentCreate, AssessmentStatus
from ..dependencies import get_coordinator
from ..core.security import check_permissions
from coordinator import AgentCoordinator
from ..models.user import UserRole

router = APIRouter()

@router.post("/", response_model=UUID)
async def create_assessment(
    assessment: AssessmentCreate,
    coordinator: AgentCoordinator = Depends(get_coordinator),
    _: dict = Depends(check_permissions([UserRole.THERAPIST, UserRole.ADMIN]))
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
    coordinator: AgentCoordinator = Depends(get_coordinator),
    _: dict = Depends(check_permissions([UserRole.THERAPIST, UserRole.ADMIN, UserRole.STAFF]))
):
    """Get current status of an assessment session"""
    try:
        status = await coordinator.get_session_status(session_id)
        return AssessmentStatus(**status)
    except ValueError:
        raise HTTPException(status_code=404, detail="Session not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))