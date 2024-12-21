from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from api.dependencies.database import get_db
from api.crud.crud_therapist import therapist
from api.schemas.therapist import Therapist, TherapistCreate, TherapistUpdate

router = APIRouter()

@router.get("/", response_model=List[Therapist])
async def read_therapists(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Retrieve all therapists.
    """
    therapists = await therapist.get_multi(db, skip=skip, limit=limit)
    return therapists

@router.post("/", response_model=Therapist)
async def create_therapist(
    *,
    db: AsyncSession = Depends(get_db),
    therapist_in: TherapistCreate
) -> Any:
    """
    Create new therapist.
    """
    # Check if email already exists
    existing_email = await therapist.get_by_email(db, email=therapist_in.email)
    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="A therapist with this email already exists."
        )
    
    # Check if license already exists
    existing_license = await therapist.get_by_license(
        db, 
        license_number=therapist_in.license_number,
        license_state=therapist_in.license_state
    )
    if existing_license:
        raise HTTPException(
            status_code=400,
            detail="A therapist with this license number and state already exists."
        )
    
    return await therapist.create(db, obj_in=therapist_in)

@router.put("/{therapist_id}", response_model=Therapist)
async def update_therapist(
    *,
    db: AsyncSession = Depends(get_db),
    therapist_id: str,
    therapist_in: TherapistUpdate
) -> Any:
    """
    Update a therapist.
    """
    existing_therapist = await therapist.get(db, id=therapist_id)
    if not existing_therapist:
        raise HTTPException(
            status_code=404,
            detail="Therapist not found"
        )
    
    # If email is being updated, check it doesn't conflict
    if therapist_in.email and therapist_in.email != existing_therapist.email:
        existing_email = await therapist.get_by_email(db, email=therapist_in.email)
        if existing_email:
            raise HTTPException(
                status_code=400,
                detail="A therapist with this email already exists."
            )
    
    # If license is being updated, check it doesn't conflict
    if (therapist_in.license_number and therapist_in.license_state) and \
       (therapist_in.license_number != existing_therapist.license_number or \
        therapist_in.license_state != existing_therapist.license_state):
        existing_license = await therapist.get_by_license(
            db,
            license_number=therapist_in.license_number,
            license_state=therapist_in.license_state
        )
        if existing_license:
            raise HTTPException(
                status_code=400,
                detail="A therapist with this license number and state already exists."
            )
    
    return await therapist.update(db, db_obj=existing_therapist, obj_in=therapist_in)

@router.get("/{therapist_id}", response_model=Therapist)
async def read_therapist(
    *,
    db: AsyncSession = Depends(get_db),
    therapist_id: str
) -> Any:
    """
    Get therapist by ID.
    """
    existing_therapist = await therapist.get(db, id=therapist_id)
    if not existing_therapist:
        raise HTTPException(
            status_code=404,
            detail="Therapist not found"
        )
    return existing_therapist

@router.delete("/{therapist_id}", response_model=Therapist)
async def delete_therapist(
    *,
    db: AsyncSession = Depends(get_db),
    therapist_id: str
) -> Any:
    """
    Delete a therapist.
    """
    existing_therapist = await therapist.get(db, id=therapist_id)
    if not existing_therapist:
        raise HTTPException(
            status_code=404,
            detail="Therapist not found"
        )
    return await therapist.remove(db, id=therapist_id)

@router.post("/{therapist_id}/increment-assessment", response_model=Therapist)
async def increment_assessment_count(
    *,
    db: AsyncSession = Depends(get_db),
    therapist_id: str
) -> Any:
    """
    Increment the assessment count for a therapist.
    """
    updated_therapist = await therapist.increment_assessment_count(db, therapist_id=therapist_id)
    if not updated_therapist:
        raise HTTPException(
            status_code=404,
            detail="Therapist not found"
        )
    return updated_therapist

@router.post("/{therapist_id}/update-rating", response_model=Therapist)
async def update_therapist_rating(
    *,
    db: AsyncSession = Depends(get_db),
    therapist_id: str,
    rating: float
) -> Any:
    """
    Update the rating for a therapist.
    """
    if rating < 0 or rating > 5:
        raise HTTPException(
            status_code=400,
            detail="Rating must be between 0 and 5"
        )
    
    updated_therapist = await therapist.update_rating(db, therapist_id=therapist_id, new_rating=rating)
    if not updated_therapist:
        raise HTTPException(
            status_code=404,
            detail="Therapist not found"
        )
    return updated_therapist