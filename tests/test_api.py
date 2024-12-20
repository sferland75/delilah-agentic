# tests/test_api.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base
from app.config import settings

# Test database URL
TEST_DATABASE_URL = "postgresql+asyncpg://test:test@localhost:5432/delilah_test"

@pytest.fixture
async def test_db():
    # Create test database
    engine = create_async_engine(TEST_DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    # Create session
    TestingSessionLocal = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with TestingSessionLocal() as session:
        yield session
        
    # Clean up
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
def client():
    return TestClient(app)

# Test data fixtures
@pytest.fixture
def test_therapist_data():
    return {
        "name": "Dr. Jane Smith",
        "email": "jane.smith@example.com",
        "license_number": "12345",
        "specialization": "Pediatric OT"
    }

@pytest.fixture
def test_client_data():
    return {
        "name": "John Doe",
        "date_of_birth": "1990-01-01",
        "contact_info": {
            "email": "john.doe@example.com",
            "phone": "123-456-7890"
        },
        "medical_history": "No significant history"
    }

@pytest.fixture
def test_assessment_data():
    return {
        "type": "Initial Assessment",
        "date": "2024-03-18",
        "findings": "Patient shows good progress",
        "recommendations": "Continue with current treatment plan"
    }

# Test cases for Therapist endpoints
async def test_create_therapist(client, test_db, test_therapist_data):
    response = client.post("/api/therapists/", json=test_therapist_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == test_therapist_data["name"]
    assert "id" in data

async def test_get_therapist(client, test_db, test_therapist_data):
    # First create a therapist
    create_response = client.post("/api/therapists/", json=test_therapist_data)
    therapist_id = create_response.json()["id"]
    
    # Then retrieve it
    response = client.get(f"/api/therapists/{therapist_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == test_therapist_data["name"]

async def test_update_therapist(client, test_db, test_therapist_data):
    # Create therapist
    create_response = client.post("/api/therapists/", json=test_therapist_data)
    therapist_id = create_response.json()["id"]
    
    # Update therapist
    updated_data = test_therapist_data.copy()
    updated_data["name"] = "Dr. Jane Smith-Jones"
    response = client.put(f"/api/therapists/{therapist_id}", json=updated_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Dr. Jane Smith-Jones"

async def test_delete_therapist(client, test_db, test_therapist_data):
    # Create therapist
    create_response = client.post("/api/therapists/", json=test_therapist_data)
    therapist_id = create_response.json()["id"]
    
    # Delete therapist
    response = client.delete(f"/api/therapists/{therapist_id}")
    assert response.status_code == 204
    
    # Verify deletion
    get_response = client.get(f"/api/therapists/{therapist_id}")
    assert get_response.status_code == 404

# Test cases for Client endpoints
async def test_create_client(client, test_db, test_client_data):
    response = client.post("/api/clients/", json=test_client_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == test_client_data["name"]
    assert "id" in data

# Test cases for Assessment endpoints
async def test_create_assessment(client, test_db, test_assessment_data, test_client_data):
    # First create a client
    client_response = client.post("/api/clients/", json=test_client_data)
    client_id = client_response.json()["id"]
    
    # Create assessment for the client
    assessment_data = test_assessment_data.copy()
    assessment_data["client_id"] = client_id
    response = client.post("/api/assessments/", json=assessment_data)
    assert response.status_code == 201
    data = response.json()
    assert data["type"] == test_assessment_data["type"]
    assert "id" in data

# Test error cases
async def test_get_nonexistent_therapist(client, test_db):
    response = client.get("/api/therapists/999")
    assert response.status_code == 404

async def test_create_therapist_invalid_data(client, test_db):
    invalid_data = {
        "name": "",  # Empty name should be invalid
        "email": "not-an-email"  # Invalid email format
    }
    response = client.post("/api/therapists/", json=invalid_data)
    assert response.status_code == 422

# Test relationships
async def test_assign_client_to_therapist(client, test_db, test_therapist_data, test_client_data):
    # Create therapist and client
    therapist_response = client.post("/api/therapists/", json=test_therapist_data)
    therapist_id = therapist_response.json()["id"]
    
    client_response = client.post("/api/clients/", json=test_client_data)
    client_id = client_response.json()["id"]
    
    # Assign client to therapist
    assignment_data = {"therapist_id": therapist_id, "client_id": client_id}
    response = client.post("/api/assignments/", json=assignment_data)
    assert response.status_code == 201
    
    # Verify assignment
    therapist_clients = client.get(f"/api/therapists/{therapist_id}/clients")
    assert therapist_clients.status_code == 200
    assert client_id in [c["id"] for c in therapist_clients.json()]