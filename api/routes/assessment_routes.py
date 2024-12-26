from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

from ..auth import get_current_user, check_permission, Role
from ..database import get_db
from ..services.assessment_service import AssessmentService
from ..services.template_service import TemplateService

router = APIRouter(prefix="/assessments", tags=["assessments"])

@router.post("/")
async def create_assessment(
    assessment_data: dict,
    current_user = Depends(check_permission([Role.THERAPIST, Role.ADMIN])),
    db: Session = Depends(get_db)
):
    template_service = TemplateService(db)
    assessment_service = AssessmentService(db)
    
    # Validate against template
    if not template_service.validate_assessment_data(
        UUID(assessment_data["template_id"]), 
        assessment_data["sections"]
    ):
        raise HTTPException(status_code=400, detail="Invalid assessment data")
    
    assessment = assessment_service.create_assessment(
        user_id=current_user.id,
        patient_id=UUID(assessment_data["patient_id"]),
        template_id=UUID(assessment_data["template_id"]),
        data=assessment_data["sections"]
    )
    
    return assessment

@router.get("/{assessment_id}")
async def get_assessment(
    assessment_id: UUID,
    current_user = Depends(check_permission([Role.THERAPIST, Role.ADMIN, Role.REVIEWER])),
    db: Session = Depends(get_db)
):
    service = AssessmentService(db)
    assessment = service.get_assessment(assessment_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment

@router.patch("/{assessment_id}")
async def update_assessment(
    assessment_id: UUID,
    update_data: dict,
    current_user = Depends(check_permission([Role.THERAPIST, Role.ADMIN])),
    db: Session = Depends(get_db)
):
    service = AssessmentService(db)
    assessment = service.update_assessment(assessment_id, update_data, current_user.id)
    return assessment

@router.post("/{assessment_id}/review")
async def review_assessment(
    assessment_id: UUID,
    review_data: dict,
    current_user = Depends(check_permission([Role.REVIEWER, Role.ADMIN])),
    db: Session = Depends(get_db)
):
    service = AssessmentService(db)
    assessment = service.review_assessment(
        assessment_id=assessment_id,
        reviewer_id=current_user.id,
        review_data=review_data
    )
    return assessment