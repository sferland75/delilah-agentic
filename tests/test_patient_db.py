import pytest
from datetime import datetime
from uuid import UUID
from sqlalchemy.orm import Session

from api.models import Patient
from api.services.patient_service import PatientService

def test_create_patient(db_session: Session):
    service = PatientService(db_session)
    patient_data = {
        "name": "John Doe",
        "date_of_birth": datetime(1990, 1, 1),
        "gender": "male",
        "medical_history": {"conditions": ["hypertension"]}
    }
    
    patient = service.create_patient(patient_data)
    assert isinstance(patient.id, UUID)
    assert patient.name == patient_data["name"]
    assert patient.date_of_birth == patient_data["date_of_birth"]

def test_get_patient(db_session: Session):
    service = PatientService(db_session)
    patient_data = {
        "name": "Jane Doe",
        "date_of_birth": datetime(1992, 5, 15),
        "gender": "female",
        "medical_history": {}
    }
    
    created_patient = service.create_patient(patient_data)
    fetched_patient = service.get_patient(created_patient.id)
    
    assert fetched_patient.id == created_patient.id
    assert fetched_patient.name == patient_data["name"]

def test_update_patient(db_session: Session):
    service = PatientService(db_session)
    patient = service.create_patient({
        "name": "Test User",
        "date_of_birth": datetime(1985, 3, 20),
        "gender": "other",
        "medical_history": {}
    })
    
    update_data = {"name": "Updated Name"}
    updated_patient = service.update_patient(patient.id, update_data)
    
    assert updated_patient.name == "Updated Name"
    assert updated_patient.date_of_birth == patient.date_of_birth

def test_delete_patient(db_session: Session):
    service = PatientService(db_session)
    patient = service.create_patient({
        "name": "To Delete",
        "date_of_birth": datetime(1995, 12, 31),
        "gender": "male",
        "medical_history": {}
    })
    
    assert service.delete_patient(patient.id) is True
    with pytest.raises(Exception):
        service.get_patient(patient.id)