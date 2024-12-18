from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from app.database.database import get_db
from app.models.assessment import Assessment
from app.models.client import Client
from app.models.therapist import Therapist
from app.schemas.assessment import (
    AssessmentCreate,
    AssessmentResponse,
    AssessmentUpdate,
    AssessmentStatus
)

router = APIRouter(prefix="/assessments", tags=["assessments"])

@router.post("/", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
async def create_assessment(
    assessment: AssessmentCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new assessment"""
    # Verify client exists
    client_query = select(Client).where(Client.id == assessment.client_id)
    client_result = await db.execute(client_query)
    if not client_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )

    # Verify therapist exists
    therapist_query = select(Therapist).where(Therapist.id == assessment.therapist_id)
    therapist_result = await db.execute(therapist_query)
    if not therapist_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Therapist not found"
        )

    db_assessment = Assessment(
        client_id=assessment.client_id,
        therapist_id=assessment.therapist_id,
        assessment_type=assessment.assessment_type,
        status=assessment.status,
        data=assessment.data.dict(),
        scheduled_date=assessment.scheduled_date,
        completed_date=assessment.completed_date if assessment.status == AssessmentStatus.COMPLETED else None
    )
    
    db.add(db_assessment)
    await db.commit()
    await db.refresh(db_assessment)
    return db_assessment

@router.get("/{assessment_id}", response_model=AssessmentResponse)
async def get_assessment(
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get an assessment by ID"""
    query = select(Assessment).where(Assessment.id == assessment_id)
    result = await db.execute(query)
    assessment = result.scalar_one_or_none()
    
    if assessment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    return assessment

@router.get("/", response_model=List[AssessmentResponse])
async def list_assessments(
    skip: int = 0,
    limit: int = 100,
    status: Optional[AssessmentStatus] = None,
    client_id: Optional[UUID] = None,
    therapist_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db)
):
    """List assessments with optional filtering"""
    query = select(Assessment)
    
    if status:
        query = query.where(Assessment.status == status)
    if client_id:
        query = query.where(Assessment.client_id == client_id)
    if therapist_id:
        query = query.where(Assessment.therapist_id == therapist_id)
        
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    assessments = result.scalars().all()
    return assessments

@router.patch("/{assessment_id}", response_model=AssessmentResponse)
async def update_assessment(
    assessment_id: UUID,
    assessment_update: AssessmentUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update an assessment"""
    query = select(Assessment).where(Assessment.id == assessment_id)
    result = await db.execute(query)
    db_assessment = result.scalar_one_or_none()
    
    if db_assessment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    update_data = assessment_update.dict(exclude_unset=True)
    
    # Handle status change to completed
    if "status" in update_data and update_data["status"] == AssessmentStatus.COMPLETED:
        update_data["completed_date"] = datetime.utcnow()
    
    # Handle nested data updates
    if "data" in update_data and update_data["data"] is not None:
        current_data = db_assessment.data or {}
        current_data.update(update_data["data"].dict())
        update_data["data"] = current_data
    
    for field, value in update_data.items():
        setattr(db_assessment, field, value)
    
    await db.commit()
    await db.refresh(db_assessment)
    return db_assessment

@router.delete("/{assessment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assessment(
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Cancel an assessment"""
    query = select(Assessment).where(Assessment.id == assessment_id)
    result = await db.execute(query)
    assessment = result.scalar_one_or_none()
    
    if assessment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    assessment.status = AssessmentStatus.CANCELLED
    await db.commit()
    return None