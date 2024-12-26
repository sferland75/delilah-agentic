from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.sync_db import SessionLocal
from database.models import Assessment, Client, AssessmentType, AssessmentResult

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/assessments", tags=["assessments"])
def get_assessments(db: Session = Depends(get_db)):
    try:
        assessments = db.query(Assessment).all()
        result = []
        for assessment in assessments:
            client = db.query(Client).filter(Client.id == assessment.client_id).first()
            assessment_type = db.query(AssessmentType).filter(AssessmentType.id == assessment.assessment_type_id).first()
            result_data = db.query(AssessmentResult).filter(AssessmentResult.assessment_id == assessment.id).first()
            
            result.append({
                "id": str(assessment.id),
                "assessment_type": assessment_type.name,
                "patient_info": {
                    "name": f"{client.first_name} {client.last_name}",
                    "age": 0,  # Calculate from date_of_birth if needed
                    "gender": "Unknown",  # Add to client model if needed
                    "medical_history": client.medical_history
                },
                "assessment_details": result_data.data if result_data else {},
                "evaluation_scores": result_data.score if result_data else {},
                "status": assessment.status
            })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/assessments/{assessment_id}", tags=["assessments"])
def get_assessment(assessment_id: int, db: Session = Depends(get_db)):
    try:
        assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        
        client = db.query(Client).filter(Client.id == assessment.client_id).first()
        assessment_type = db.query(AssessmentType).filter(AssessmentType.id == assessment.assessment_type_id).first()
        result_data = db.query(AssessmentResult).filter(AssessmentResult.assessment_id == assessment.id).first()
        
        return {
            "id": str(assessment.id),
            "assessment_type": assessment_type.name,
            "patient_info": {
                "name": f"{client.first_name} {client.last_name}",
                "age": 0,
                "gender": "Unknown",
                "medical_history": client.medical_history
            },
            "assessment_details": result_data.data if result_data else {},
            "evaluation_scores": result_data.score if result_data else {},
            "status": assessment.status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
