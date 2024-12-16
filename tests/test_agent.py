from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import pytest
import uuid

from api.dependencies import get_db
from database.models import Base
from main import app

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override the dependency
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine)
    yield TestClient(app)
    Base.metadata.drop_all(bind=engine)

def test_create_agent(client):
    response = client.post(
        "/agents/",
        json={
            "name": "Test Agent",
            "type": "assistant",
            "state": {"memory": "empty"},
            "active": True
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Agent"
    assert data["type"] == "assistant"
    assert "id" in data
    assert "created_at" in data

def test_create_agent_invalid(client):
    response = client.post(
        "/agents/",
        json={
            "name": "Te",  # Too short
            "type": "assistant",
            "state": {"memory": "empty"},
            "active": True
        }
    )
    assert response.status_code == 422

def test_get_agent(client):
    # First create an agent
    create_response = client.post(
        "/agents/",
        json={
            "name": "Test Agent",
            "type": "assistant",
            "state": {},
            "active": True
        }
    )
    agent_id = create_response.json()["id"]
    
    # Then retrieve it
    response = client.get(f"/agents/{agent_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Agent"
    assert data["id"] == agent_id

def test_get_agent_not_found(client):
    non_existent_id = str(uuid.uuid4())
    response = client.get(f"/agents/{non_existent_id}")
    assert response.status_code == 404

def test_list_agents(client):
    # Create multiple agents
    agent_names = ["Agent 1", "Agent 2", "Agent 3"]
    for name in agent_names:
        client.post(
            "/agents/",
            json={
                "name": name,
                "type": "assistant",
                "state": {},
                "active": True
            }
        )
    
    response = client.get("/agents/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert [agent["name"] for agent in data] == agent_names

def test_update_agent(client):
    # Create an agent
    create_response = client.post(
        "/agents/",
        json={
            "name": "Test Agent",
            "type": "assistant",
            "state": {},
            "active": True
        }
    )
    agent_id = create_response.json()["id"]
    
    # Update it
    response = client.put(
        f"/agents/{agent_id}",
        json={
            "name": "Updated Agent",
            "active": False
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Agent"
    assert data["active"] == False

def test_delete_agent(client):
    # Create an agent
    create_response = client.post(
        "/agents/",
        json={
            "name": "Test Agent",
            "type": "assistant",
            "state": {},
            "active": True
        }
    )
    agent_id = create_response.json()["id"]
    
    # Delete it
    response = client.delete(f"/agents/{agent_id}")
    assert response.status_code == 200
    
    # Verify it's gone
    get_response = client.get(f"/agents/{agent_id}")
    assert get_response.status_code == 404