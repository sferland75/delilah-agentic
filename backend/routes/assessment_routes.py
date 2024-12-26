from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from database import get_db
from services.assessment_service import AssessmentService, Assessment

router = APIRouter()

@router.post("/assessments/", response_model=Assessment)
async def create_assessment(
    assessment_data: dict,
    db = Depends(get_db),
    assessment_service: AssessmentService = Depends(lambda: AssessmentService(db))
):
    return await assessment_service.create_assessment(assessment_data)

@router.get("/assessments/{assessment_id}", response_model=Assessment)
async def get_assessment(
    assessment_id: str,
    db = Depends(get_db),
    assessment_service: AssessmentService = Depends(lambda: AssessmentService(db))
):
    assessment = await assessment_service.get_assessment(assessment_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment

@router.get("/assessments/", response_model=List[Assessment])
async def list_assessments(
    patient_id: Optional[str] = None,
    therapist_id: Optional[str] = None,
    status: Optional[str] = None,
    db = Depends(get_db),
    assessment_service: AssessmentService = Depends(lambda: AssessmentService(db))
):
    return await assessment_service.list_assessments(patient_id, therapist_id, status)

@router.put("/assessments/{assessment_id}", response_model=Assessment)
async def update_assessment(
    assessment_id: str,
    assessment_data: dict,
    db = Depends(get_db),
    assessment_service: AssessmentService = Depends(lambda: AssessmentService(db))
):
    assessment = await assessment_service.update_assessment(assessment_id, assessment_data)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment

@router.delete("/assessments/{assessment_id}")
async def delete_assessment(
    assessment_id: str,
    db = Depends(get_db),
    assessment_service: AssessmentService = Depends(lambda: AssessmentService(db))
):
    success = await assessment_service.delete_assessment(assessment_id)
    if not success:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return {"message": "Assessment deleted successfully"}