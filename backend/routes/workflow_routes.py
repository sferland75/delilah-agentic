from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Optional
from ..services.workflow_service import WorkflowService, AssessmentStatus
from ..database import get_db

router = APIRouter()

@router.post("/workflow/{assessment_id}/transition")
async def transition_status(
    assessment_id: str,
    from_status: AssessmentStatus,
    to_status: AssessmentStatus,
    user_id: str,
    transition_data: Optional[Dict] = None,
    db = Depends(get_db),
    workflow_service: WorkflowService = Depends(lambda: WorkflowService(db))
):
    success, error = await workflow_service.transition_status(
        assessment_id,
        from_status,
        to_status,
        user_id,
        transition_data
    )
    
    if not success:
        raise HTTPException(status_code=400, detail=error)
        
    return {"message": "Status transitioned successfully"}

@router.get("/workflow/{assessment_id}/possible-transitions")
async def get_possible_transitions(
    assessment_id: str,
    current_status: AssessmentStatus,
    user_id: str,
    db = Depends(get_db),
    workflow_service: WorkflowService = Depends(lambda: WorkflowService(db))
):
    possible_transitions = []
    for to_status in AssessmentStatus:
        can_transition, error = await workflow_service.can_transition(
            assessment_id,
            current_status,
            to_status,
            user_id
        )
        if can_transition:
            possible_transitions.append(to_status)
            
    return {"possible_transitions": possible_transitions}

@router.get("/workflow/{assessment_id}/validate")
async def validate_assessment(
    assessment_id: str,
    rules: list[str],
    db = Depends(get_db),
    workflow_service: WorkflowService = Depends(lambda: WorkflowService(db))
):
    assessment = await workflow_service._get_assessment(assessment_id)
    validation_errors = await workflow_service.validate_assessment(assessment, rules)
    
    return {
        "is_valid": len(validation_errors) == 0,
        "errors": validation_errors
    }