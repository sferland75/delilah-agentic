from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from ..auth import get_current_user, check_permission, Role
from ..database import get_db
from ..services.review_service import ReviewService
from ..schemas.review import ReviewCreate, ReviewResponse, ReviewUpdate

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.post("/{assessment_id}", response_model=ReviewResponse)
async def create_review(
    assessment_id: UUID,
    review_data: ReviewCreate,
    current_user = Depends(check_permission([Role.REVIEWER, Role.ADMIN])),
    db: Session = Depends(get_db)
):
    service = ReviewService(db)
    return service.create_review(assessment_id, current_user.id, review_data.dict())

@router.get("/{review_id}", response_model=ReviewResponse)
async def get_review(
    review_id: UUID,
    current_user = Depends(check_permission([Role.THERAPIST, Role.REVIEWER, Role.ADMIN])),
    db: Session = Depends(get_db)
):
    service = ReviewService(db)
    review = service.get_review(review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

@router.patch("/{review_id}", response_model=ReviewResponse)
async def update_review(
    review_id: UUID,
    review_data: ReviewUpdate,
    current_user = Depends(check_permission([Role.REVIEWER, Role.ADMIN])),
    db: Session = Depends(get_db)
):
    service = ReviewService(db)
    return service.update_review(review_id, review_data.dict(exclude_unset=True))

@router.post("/{review_id}/complete", response_model=ReviewResponse)
async def complete_review(
    review_id: UUID,
    current_user = Depends(check_permission([Role.REVIEWER, Role.ADMIN])),
    db: Session = Depends(get_db)
):
    service = ReviewService(db)
    return service.complete_review(review_id)

@router.post("/{review_id}/reject", response_model=ReviewResponse)
async def reject_review(
    review_id: UUID,
    reason: str,
    current_user = Depends(check_permission([Role.REVIEWER, Role.ADMIN])),
    db: Session = Depends(get_db)
):
    service = ReviewService(db)
    return service.reject_review(review_id, reason)

@router.get("/assessment/{assessment_id}", response_model=List[ReviewResponse])
async def get_assessment_reviews(
    assessment_id: UUID,
    current_user = Depends(check_permission([Role.THERAPIST, Role.REVIEWER, Role.ADMIN])),
    db: Session = Depends(get_db)
):
    service = ReviewService(db)
    return service.get_reviews_by_assessment(assessment_id)