from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from uuid import UUID

from app.database.database import get_db
from app.models.therapist import Therapist
from app.schemas.therapist import TherapistCreate, TherapistResponse, TherapistUpdate

router = APIRouter(prefix="/therapists", tags=["therapists"])

@router.post("/", response_model=TherapistResponse, status_code=status.HTTP_201_CREATED)
async def create_therapist(
    therapist: TherapistCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new therapist"""
    db_therapist = Therapist(
        first_name=therapist.first_name,
        last_name=therapist.last_name,
        credentials=therapist.credentials.dict(),
        specialties=therapist.specialties,
        active=True
    )
    
    db.add(db_therapist)
    await db.commit()
    await db.refresh(db_therapist)
    return db_therapist

@router.get("/{therapist_id}", response_model=TherapistResponse)
async def get_therapist(
    therapist_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a therapist by ID"""
    query = select(Therapist).where(Therapist.id == therapist_id)
    result = await db.execute(query)
    therapist = result.scalar_one_or_none()
    
    if therapist is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Therapist not found"
        )
    return therapist

@router.get("/", response_model=List[TherapistResponse])
async def list_therapists(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    specialty: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """List all therapists with optional filtering"""
    query = select(Therapist)
    if active_only:
        query = query.where(Therapist.active == True)
    if specialty:
        query = query.where(Therapist.specialties.contains([specialty]))
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    therapists = result.scalars().all()
    return therapists

@router.patch("/{therapist_id}", response_model=TherapistResponse)
async def update_therapist(
    therapist_id: UUID,
    therapist_update: TherapistUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a therapist"""
    query = select(Therapist).where(Therapist.id == therapist_id)
    result = await db.execute(query)
    db_therapist = result.scalar_one_or_none()
    
    if db_therapist is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Therapist not found"
        )
    
    update_data = therapist_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field == "credentials" and value is not None:
            current_value = getattr(db_therapist, field) or {}
            current_value.update(value.dict(exclude_unset=True))
            setattr(db_therapist, field, current_value)
        else:
            setattr(db_therapist, field, value)
    
    await db.commit()
    await db.refresh(db_therapist)
    return db_therapist

@router.delete("/{therapist_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_therapist(
    therapist_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Soft delete a therapist"""
    query = select(Therapist).where(Therapist.id == therapist_id)
    result = await db.execute(query)
    therapist = result.scalar_one_or_none()
    
    if therapist is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Therapist not found"
        )
    
    therapist.active = False
    await db.commit()
    return None