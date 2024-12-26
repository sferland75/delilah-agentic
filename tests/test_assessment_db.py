import pytest
from datetime import datetime
from uuid import uuid4
from sqlalchemy.orm import Session

from api.models import Assessment, User, Patient
from api.services.assessment_service import AssessmentService

@pytest.fixture
def test_patient(db_session):
    patient = Patient(
        id=uuid4(),
        name="Test Patient",
        date_of_birth=datetime(1990, 1, 1),
        gender="male"
    )
    db_session.add(patient)
    db_session.commit()
    return patient

@pytest.fixture
def test_user(db_session):
    user = User(
        id=uuid4(),
        email="test@example.com",
        full_name="Test User",
        hashed_password="dummy_hash",
        roles=["therapist"]
    )
    db_session.add(user)
    db_session.commit()
    return user

def test_create_assessment(db_session: Session, test_patient, test_user):
    service = AssessmentService(db_session)
    assessment_data = {
        "assessment_type": "initial",
        "data": {
            "functional_mobility": {
                "score": 8,
                "notes": "Good mobility"
            }
        },
        "status": "draft"
    }
    
    assessment = service.create_assessment(assessment_data, test_user.id, test_patient.id)
    assert assessment.assessment_type == "initial"
    assert assessment.created_by_id == test_user.id
    assert assessment.status == "draft"

def test_get_assessment(db_session: Session, test_patient, test_user):
    service = AssessmentService(db_session)
    assessment_data = {
        "assessment_type": "progress",
        "data": {"test": "data"},
        "status": "draft"
    }
    
    created = service.create_assessment(assessment_data, test_user.id, test_patient.id)
    fetched = service.get_assessment(created.id)
    
    assert fetched.id == created.id
    assert fetched.assessment_type == "progress"

def test_get_assessments_by_patient(db_session: Session, test_patient, test_user):
    service = AssessmentService(db_session)
    
    # Create multiple assessments
    for _ in range(3):
        service.create_assessment({
            "assessment_type": "initial",
            "data": {"test": "data"},
            "status": "draft"
        }, test_user.id, test_patient.id)
    
    assessments = service.get_assessments_by_patient(test_patient.id)
    assert len(assessments) == 3

def test_update_assessment_status(db_session: Session, test_patient, test_user):
    service = AssessmentService(db_session)
    assessment = service.create_assessment({
        "assessment_type": "initial",
        "data": {"test": "data"},
        "status": "draft"
    }, test_user.id, test_patient.id)
    
    reviewer = User(
        id=uuid4(),
        email="reviewer@example.com",
        full_name="Test Reviewer",
        hashed_password="dummy_hash",
        roles=["reviewer"]
    )
    db_session.add(reviewer)
    db_session.commit()
    
    updated = service.update_assessment_status(assessment.id, "reviewed", reviewer.id)
    assert updated.status == "reviewed"
    assert updated.reviewed_by_id == reviewer.id

def test_invalid_assessment_status(db_session: Session, test_patient, test_user):
    service = AssessmentService(db_session)
    assessment = service.create_assessment({
        "assessment_type": "initial",
        "data": {"test": "data"},
        "status": "draft"
    }, test_user.id, test_patient.id)
    
    with pytest.raises(ValueError):
        service.update_assessment_status(assessment.id, "invalid_status", test_user.id)