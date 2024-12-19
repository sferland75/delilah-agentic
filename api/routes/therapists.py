from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from uuid import UUID

from ..models.therapist import Therapist, TherapistCreate, TherapistUpdate
from ..dependencies import get_coordinator
from ..core.security import check_permissions, get_current_user
from coordinator import AgentCoordinator
from ..models.user import UserRole, User

router = APIRouter()

@router.post("/", response_model=Therapist)
async def create_therapist(
    therapist: TherapistCreate,
    coordinator: AgentCoordinator = Depends(get_coordinator),
    _: dict = Depends(check_permissions([UserRole.ADMIN]))
):
    """Create a new therapist"""
    try:
        return await coordinator.therapist_manager.create_therapist(therapist)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{therapist_id}", response_model=Therapist)
async def get_therapist(
    therapist_id: UUID,
    coordinator: AgentCoordinator = Depends(get_coordinator),
    _: dict = Depends(check_permissions([UserRole.ADMIN, UserRole.STAFF]))
):
    """Get therapist by ID"""
    therapist = await coordinator.therapist_manager.get_therapist(therapist_id)
    if not therapist:
        raise HTTPException(status_code=404, detail="Therapist not found")
    return therapist

@router.get("/", response_model=List[Therapist])
async def list_therapists(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    specialization: Optional[str] = None,
    state: Optional[str] = None,
    coordinator: AgentCoordinator = Depends(get_coordinator),
    _: dict = Depends(check_permissions([UserRole.ADMIN, UserRole.STAFF]))
):
    """List therapists with optional filters"""
    return await coordinator.therapist_manager.list_therapists(
        skip=skip,
        limit=limit,
        specialization=specialization,
        state=state
    )

@router.put("/{therapist_id}", response_model=Therapist)
async def update_therapist(
    therapist_id: UUID,
    therapist_update: TherapistUpdate,
    coordinator: AgentCoordinator = Depends(get_coordinator),
    current_user: User = Depends(get_current_user)
):
    """Update therapist information"""
    try:
        # Allow therapists to update their own profile
        if current_user.role != UserRole.ADMIN and str(therapist_id) != str(current_user.id):
            raise HTTPException(
                status_code=403,
                detail="Not authorized to update other therapists' information"
            )
            
        therapist = await coordinator.therapist_manager.update_therapist(
            therapist_id,
            therapist_update
        )
        if not therapist:
            raise HTTPException(status_code=404, detail="Therapist not found")
        return therapist
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{therapist_id}")
async def delete_therapist(
    therapist_id: UUID,
    coordinator: AgentCoordinator = Depends(get_coordinator),
    _: dict = Depends(check_permissions([UserRole.ADMIN]))
):
    """Soft delete a therapist"""
    try:
        await coordinator.therapist_manager.delete_therapist(therapist_id)
        return {"status": "success", "message": "Therapist deactivated successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{therapist_id}/stats", response_model=dict)
async def get_therapist_stats(
    therapist_id: UUID,
    coordinator: AgentCoordinator = Depends(get_coordinator),
    current_user: User = Depends(get_current_user)
):
    """Get therapist statistics"""
    try:
        # Allow therapists to view their own stats
        if current_user.role != UserRole.ADMIN and str(therapist_id) != str(current_user.id):
            raise HTTPException(
                status_code=403,
                detail="Not authorized to view other therapists' statistics"
            )
            
        return await coordinator.therapist_manager.get_therapist_stats(therapist_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/me/stats", response_model=dict)
async def get_my_stats(
    coordinator: AgentCoordinator = Depends(get_coordinator),
    current_user: User = Depends(check_permissions([UserRole.THERAPIST]))
):
    """Get current therapist's statistics"""
    try:
        return await coordinator.therapist_manager.get_therapist_stats(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))