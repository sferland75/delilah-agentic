from sqlalchemy.orm import Session
from typing import List, Optional
from ..models import Patient
from fastapi import HTTPException
from uuid import UUID

class PatientService:
    def __init__(self, db: Session):
        self.db = db

    def create_patient(self, data: dict) -> Patient:
        patient = Patient(**data)
        self.db.add(patient)
        self.db.commit()
        self.db.refresh(patient)
        return patient

    def get_patient(self, patient_id: UUID) -> Optional[Patient]:
        patient = self.db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        return patient

    def get_patients(self, skip: int = 0, limit: int = 100) -> List[Patient]:
        return self.db.query(Patient).offset(skip).limit(limit).all()

    def update_patient(self, patient_id: UUID, data: dict) -> Patient:
        patient = self.get_patient(patient_id)
        for key, value in data.items():
            setattr(patient, key, value)
        self.db.commit()
        self.db.refresh(patient)
        return patient

    def delete_patient(self, patient_id: UUID) -> bool:
        patient = self.get_patient(patient_id)
        self.db.delete(patient)
        self.db.commit()
        return True