import pytest
from datetime import datetime, timedelta
from uuid import uuid4
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from monitoring.learning_metrics import LearningMetricBase, PatternMetricBase
from database.models.learning import LearningMetric, PatternMetric

@pytest.fixture
def test_metric():
    return LearningMetricBase(
        agent_id=uuid4(),
        metric_type="test_metric",
        value=0.95,
        metadata={"test": "data"}
    )

@pytest.fixture
def test_pattern():
    return PatternMetricBase(
        agent_id=uuid4(),
        pattern_id=uuid4(),
        confidence=0.85,
        usage_count=10,
        success_rate=0.9,
        metadata={"test": "pattern"}
    )

def test_record_learning_metric(client: TestClient, db: Session, test_metric):
    response = client.post(
        "/monitoring/learning/metrics",
        json=test_metric.dict()
    )
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    
    # Verify database record
    db_metric = db.query(LearningMetric).filter_by(id=data["id"]).first()
    assert db_metric is not None
    assert db_metric.metric_type == test_metric.metric_type
    assert db_metric.value == test_metric.value

def test_record_pattern_metric(client: TestClient, db: Session, test_pattern):
    response = client.post(
        "/monitoring/learning/patterns",
        json=test_pattern.dict()
    )
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    
    # Verify database record
    db_pattern = db.query(PatternMetric).filter_by(id=data["id"]).first()
    assert db_pattern is not None
    assert db_pattern.confidence == test_pattern.confidence
    assert db_pattern.success_rate == test_pattern.success_rate

def test_get_agent_metrics(client: TestClient, db: Session, test_metric):
    # Create test metrics
    for _ in range(3):
        client.post(
            "/monitoring/learning/metrics",
            json=test_metric.dict()
        )
    
    # Query metrics
    response = client.get(f"/monitoring/learning/metrics/{test_metric.agent_id}")
    assert response.status_code == 200
    data = response.json()
    
    assert len(data) == 3
    for metric in data:
        assert metric["agent_id"] == str(test_metric.agent_id)
        assert metric["metric_type"] == test_metric.metric_type

def test_get_agent_patterns(client: TestClient, db: Session, test_pattern):
    # Create test patterns
    client.post(
        "/monitoring/learning/patterns",
        json=test_pattern.dict()
    )
    
    # Query patterns
    response = client.get(
        f"/monitoring/learning/patterns/{test_pattern.agent_id}",
        params={"min_confidence": 0.8}
    )
    assert response.status_code == 200
    data = response.json()
    
    assert len(data) == 1
    pattern = data[0]
    assert pattern["agent_id"] == str(test_pattern.agent_id)
    assert pattern["confidence"] >= 0.8

def test_get_system_metrics(client: TestClient, db: Session, test_metric, test_pattern):
    # Create test data
    for _ in range(3):
        client.post(
            "/monitoring/learning/metrics",
            json=test_metric.dict()
        )
    client.post(
        "/monitoring/learning/patterns",
        json=test_pattern.dict()
    )
    
    # Query system metrics
    response = client.get(
        "/monitoring/learning/system",
        params={"time_window": 24}
    )
    assert response.status_code == 200
    data = response.json()
    
    assert data["total_metrics"] == 3
    assert data["total_patterns"] == 1
    assert "pattern_confidence_avg" in data
    assert "pattern_success_rate_avg" in data
    assert "metrics_by_type" in data
    assert data["time_window_hours"] == 24

def test_metric_aggregation(client: TestClient, db: Session):
    # Create metrics of different types
    metrics = [
        LearningMetricBase(
            agent_id=uuid4(),
            metric_type="type_a",
            value=val
        ) for val in [0.5, 0.7, 0.9]
    ] + [
        LearningMetricBase(
            agent_id=uuid4(),
            metric_type="type_b",
            value=val
        ) for val in [0.2, 0.4, 0.6]
    ]
    
    for metric in metrics:
        client.post(
            "/monitoring/learning/metrics",
            json=metric.dict()
        )
    
    # Query system metrics
    response = client.get("/monitoring/learning/system")
    assert response.status_code == 200
    data = response.json()
    
    metrics_by_type = data["metrics_by_type"]
    assert "type_a" in metrics_by_type
    assert "type_b" in metrics_by_type
    
    type_a = metrics_by_type["type_a"]
    assert type_a["count"] == 3
    assert type_a["min"] == 0.5
    assert type_a["max"] == 0.9
    assert type_a["avg"] == pytest.approx(0.7)
    
    type_b = metrics_by_type["type_b"]
    assert type_b["count"] == 3
    assert type_b["min"] == 0.2
    assert type_b["max"] == 0.6
    assert type_b["avg"] == pytest.approx(0.4)