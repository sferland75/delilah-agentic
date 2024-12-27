from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from ...database import get_db
from ...crud import assessment as assessment_crud
from ...schemas import assessment as assessment_schemas
from ...auth.jwt import get_current_active_user
from ...auth.schemas import User

router = APIRouter()

@router.post("/", response_model=assessment_schemas.Assessment)
async def create_assessment(
    assessment: assessment_schemas.AssessmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return assessment_crud.create_assessment(
        db=db,
        assessment_data=assessment.dict(),
        therapist_id=current_user.id
    )

@router.get("/", response_model=List[assessment_schemas.Assessment])
async def read_assessments(
    skip: int = 0,
    limit: int = 100,
    patient_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    therapist_id = None if current_user.role in ["admin", "supervisor"] else current_user.id
    return assessment_crud.get_assessments(
        db, skip=skip, limit=limit, therapist_id=therapist_id, patient_id=patient_id
    )

@router.get("/{assessment_id}", response_model=assessment_schemas.Assessment)
async def read_assessment(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    assessment = assessment_crud.get_assessment(db, assessment_id=assessment_id)
    if assessment is None:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    if current_user.role not in ["admin", "supervisor"] and assessment.therapist_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this assessment"
        )
    return assessment

@router.put("/{assessment_id}", response_model=assessment_schemas.Assessment)
async def update_assessment(
    assessment_id: int,
    assessment: assessment_schemas.AssessmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    therapist_id = None if current_user.role in ["admin", "supervisor"] else current_user.id
    return assessment_crud.update_assessment(
        db=db,
        assessment_id=assessment_id,
        assessment_data=assessment.dict(exclude_unset=True),
        therapist_id=therapist_id
    )