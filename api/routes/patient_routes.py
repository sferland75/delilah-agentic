from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from ..auth import get_current_user, check_permission, Role
from ..database import get_db
from ..services.patient_service import PatientService
from ..schemas.patient import PatientCreate, PatientResponse, PatientUpdate

router = APIRouter(prefix="/patients", tags=["patients"])

@router.post("/", response_model=PatientResponse)
async def create_patient(
    patient: PatientCreate,
    current_user = Depends(check_permission([Role.THERAPIST, Role.ADMIN])),
    db: Session = Depends(get_db)
):
    service = PatientService(db)
    return service.create_patient(patient.dict())

@router.get("/{patient_id}", response_model=PatientResponse)
async def get_patient(
    patient_id: UUID,
    current_user = Depends(check_permission([Role.THERAPIST, Role.ADMIN])),
    db: Session = Depends(get_db)
):
    service = PatientService(db)
    return service.get_patient(patient_id)

@router.get("/", response_model=List[PatientResponse])
async def list_patients(
    skip: int = 0,
    limit: int = 100,
    current_user = Depends(check_permission([Role.THERAPIST, Role.ADMIN])),
    db: Session = Depends(get_db)
):
    service = PatientService(db)
    return service.get_patients(skip, limit)

@router.patch("/{patient_id}", response_model=PatientResponse)
async def update_patient(
    patient_id: UUID,
    patient_update: PatientUpdate,
    current_user = Depends(check_permission([Role.THERAPIST, Role.ADMIN])),
    db: Session = Depends(get_db)
):
    service = PatientService(db)
    return service.update_patient(patient_id, patient_update.dict(exclude_unset=True))

@router.delete("/{patient_id}")
async def delete_patient(
    patient_id: UUID,
    current_user = Depends(check_permission([Role.ADMIN])),
    db: Session = Depends(get_db)
):
    service = PatientService(db)
    service.delete_patient(patient_id)
    return {"message": "Patient deleted successfully"}