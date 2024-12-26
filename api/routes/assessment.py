from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Dict, Any
from uuid import UUID

from api.models.assessment import (
    AssessmentCreate,
    AssessmentResponse,
    AssessmentStatus,
    AssessmentType
)
from api.services.assessment import AssessmentService
from api.deps import get_assessment_service

router = APIRouter()

@router.post("/", 
    response_model=AssessmentResponse,
    status_code=status.HTTP_201_CREATED,
    description="Create a new assessment session"
)
async def create_assessment(
    assessment: AssessmentCreate,
    service: AssessmentService = Depends(get_assessment_service)
):
    """
    Create a new assessment session with the following data:
    - client_id: UUID of the client
    - therapist_id: UUID of the therapist
    - assessment_type: Type of assessment (initial_evaluation, progress_note, etc.)
    - notes: Optional notes about the assessment
    """
    try:
        db_assessment = await service.create_assessment(assessment)
        return AssessmentResponse.from_orm(db_assessment)
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{assessment_id}",
    response_model=AssessmentResponse,
    description="Get assessment details by ID"
)
async def get_assessment(
    assessment_id: UUID,
    service: AssessmentService = Depends(get_assessment_service)
):
    """
    Retrieve assessment details by assessment ID
    """
    try:
        assessment = await service.get_assessment(assessment_id)
        if not assessment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assessment not found"
            )
        return AssessmentResponse.from_orm(assessment)
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.get("/{assessment_id}/next-step",
    response_model=Dict[str, Any],
    description="Get next assessment step"
)
async def get_next_step(
    assessment_id: UUID,
    service: AssessmentService = Depends(get_assessment_service)
):
    """
    Get the next step for an assessment
    """
    try:
        step = await service.get_next_step(assessment_id)
        if not step:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No more steps available"
            )
        return step
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

@router.post("/{assessment_id}/steps/{step_number}",
    response_model=AssessmentResponse,
    description="Submit assessment step data"
)
async def submit_step_data(
    assessment_id: UUID,
    step_number: int,
    data: Dict[str, Any],
    service: AssessmentService = Depends(get_assessment_service)
):
    """
    Submit data for a specific assessment step
    """
    try:
        assessment = await service.submit_step_data(assessment_id, step_number, data)
        return AssessmentResponse.from_orm(assessment)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )