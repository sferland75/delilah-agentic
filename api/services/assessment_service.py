from sqlalchemy.orm import Session
from typing import List, Optional
from ..models import Assessment, User, Patient
from fastapi import HTTPException, status
from uuid import UUID

class AssessmentService:
    def __init__(self, db: Session):
        self.db = db

    def create_assessment(self, data: dict, user_id: UUID, patient_id: UUID) -> Assessment:
        patient = self.db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")

        assessment = Assessment(
            patient_id=patient_id,
            created_by_id=user_id,
            assessment_type=data["assessment_type"],
            status="draft",
            data=data
        )
        self.db.add(assessment)
        self.db.commit()
        self.db.refresh(assessment)
        return assessment

    def get_assessment(self, assessment_id: UUID) -> Optional[Assessment]:
        return self.db.query(Assessment).filter(Assessment.id == assessment_id).first()

    def get_assessments_by_user(self, user_id: UUID) -> List[Assessment]:
        return self.db.query(Assessment).filter(Assessment.created_by_id == user_id).all()

    def get_assessments_for_review(self, user_id: UUID) -> List[Assessment]:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user or 'reviewer' not in user.roles:
            raise HTTPException(status_code=403, detail="Not authorized to review assessments")
            
        return self.db.query(Assessment).filter(
            Assessment.status == "pending_review"
        ).all()

    def update_assessment_status(self, assessment_id: UUID, status: str, user_id: UUID) -> Assessment:
        assessment = self.get_assessment(assessment_id)
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")

        if status == "reviewed" and not assessment.reviewed_by_id:
            assessment.reviewed_by_id = user_id

        assessment.status = status
        self.db.commit()
        self.db.refresh(assessment)
        return assessment