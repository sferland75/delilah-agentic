from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from api.dependencies.database import get_db
from api.crud.crud_assessment import assessment
from api.schemas.assessment import Assessment, AssessmentCreate, AssessmentUpdate
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=List[Assessment])
async def read_assessments(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Retrieve all assessments.
    """
    assessments = await assessment.get_multi(db, skip=skip, limit=limit)
    return assessments

@router.post("/", response_model=Assessment)
async def create_assessment(
    *,
    db: AsyncSession = Depends(get_db),
    assessment_in: AssessmentCreate
) -> Any:
    """
    Create new assessment.
    """
    return await assessment.create(db, obj_in=assessment_in)

@router.get("/client/{client_id}", response_model=List[Assessment])
async def read_client_assessments(
    client_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get all assessments for a specific client.
    """
    assessments = await assessment.get_by_client(db, client_id=client_id)
    return assessments

@router.get("/therapist/{therapist_id}", response_model=List[Assessment])
async def read_therapist_assessments(
    therapist_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get all assessments for a specific therapist.
    """
    assessments = await assessment.get_by_therapist(db, therapist_id=therapist_id)
    return assessments

@router.get("/status/{status}", response_model=List[Assessment])
async def read_assessments_by_status(
    status: str,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Get all assessments with a specific status.
    """
    assessments = await assessment.get_by_status(db, status=status)
    return assessments

@router.put("/{assessment_id}", response_model=Assessment)
async def update_assessment(
    *,
    db: AsyncSession = Depends(get_db),
    assessment_id: UUID,
    assessment_in: AssessmentUpdate
) -> Any:
    """
    Update an assessment.
    """
    assessment_obj = await assessment.get(db, id=assessment_id)
    if not assessment_obj:
        raise HTTPException(
            status_code=404,
            detail="Assessment not found"
        )
    return await assessment.update(db, db_obj=assessment_obj, obj_in=assessment_in)

@router.get("/{assessment_id}", response_model=Assessment)
async def read_assessment(
    *,
    db: AsyncSession = Depends(get_db),
    assessment_id: UUID
) -> Any:
    """
    Get assessment by ID.
    """
    assessment_obj = await assessment.get(db, id=assessment_id)
    if not assessment_obj:
        raise HTTPException(
            status_code=404,
            detail="Assessment not found"
        )
    return assessment_obj

@router.delete("/{assessment_id}", response_model=Assessment)
async def delete_assessment(
    *,
    db: AsyncSession = Depends(get_db),
    assessment_id: UUID
) -> Any:
    """
    Delete an assessment.
    """
    assessment_obj = await assessment.get(db, id=assessment_id)
    if not assessment_obj:
        raise HTTPException(
            status_code=404,
            detail="Assessment not found"
        )
    return await assessment.remove(db, id=assessment_id)