import pytest
from datetime import datetime, timedelta
from uuid import uuid4
from sqlalchemy.orm import Session
from database.models.learning import LearningMetric, PatternMetric
from api.routes.learning_metrics import get_time_range
from fastapi.testclient import TestClient

@pytest.fixture
def test_metrics(db: Session):
    # Create test metrics
    metrics = [
        LearningMetric(
            id=uuid4(),
            agent_id=str(uuid4()),
            metric_type='performance',
            value=0.85,
            timestamp=datetime.utcnow() - timedelta(hours=i),
            metadata={'test': 'data'}
        )
        for i in range(48)  # 48 hours of data
    ]
    
    for metric in metrics:
        db.add(metric)
    
    db.commit()
    return metrics

@pytest.fixture
def test_patterns(db: Session):
    # Create test patterns
    patterns = [
        PatternMetric(
            id=uuid4(),
            agent_id=str(uuid4()),
            pattern_id=str(uuid4()),
            confidence=0.9,
            usage_count=10,
            success_rate=0.85,
            timestamp=datetime.utcnow() - timedelta(hours=i),
            metadata={'type': 'test_pattern'}
        )
        for i in range(24)  # 24 hours of data
    ]
    
    for pattern in patterns:
        db.add(pattern)
    
    db.commit()
    return patterns

def test_get_time_range():
    # Test 24h range
    range_24h = get_time_range('24h')
    assert datetime.utcnow() - range_24h < timedelta(hours=25)
    assert datetime.utcnow() - range_24h > timedelta(hours=23)
    
    # Test 7d range
    range_7d = get_time_range('7d')
    assert datetime.utcnow() - range_7d < timedelta(days=8)
    assert datetime.utcnow() - range_7d > timedelta(days=6)
    
    # Test 30d range
    range_30d = get_time_range('30d')
    assert datetime.utcnow() - range_30d < timedelta(days=31)
    assert datetime.utcnow() - range_30d > timedelta(days=29)

def test_get_learning_metrics(client: TestClient, test_metrics, test_patterns):
    # Test default parameters
    response = client.get('/api/monitoring/learning/metrics')
    assert response.status_code == 200
    data = response.json()
    
    # Verify response structure
    assert isinstance(data, list)
    for agent_data in data:
        assert 'agent_id' in agent_data
        assert 'metrics' in agent_data
        assert 'patterns' in agent_data
        
        # Verify metrics
        for metric in agent_data['metrics']:
            assert 'timestamp' in metric
            assert 'value' in metric
            assert 'metric_type' in metric
            
        # Verify patterns
        for pattern in agent_data['patterns']:
            assert 'pattern_id' in pattern
            assert 'confidence' in pattern
            assert 'success_rate' in pattern

def test_get_learning_metrics_filtering(client: TestClient, test_metrics, test_patterns):
    # Test agent filtering
    agent_id = test_metrics[0].agent_id
    response = client.get(f'/api/monitoring/learning/metrics?agent={agent_id}')
    assert response.status_code == 200
    data = response.json()
    
    # Verify only requested agent's data is returned
    assert len(data) == 1
    assert data[0]['agent_id'] == agent_id

def test_get_learning_metrics_time_range(client: TestClient, test_metrics, test_patterns):
    # Test time range filtering
    response = client.get('/api/monitoring/learning/metrics?time_range=24h')
    assert response.status_code == 200
    data = response.json()
    
    # Verify only recent data is returned
    for agent_data in data:
        for metric in agent_data['metrics']:
            metric_time = datetime.fromisoformat(metric['timestamp'])
            assert datetime.utcnow() - metric_time < timedelta(hours=25)

def test_get_system_health(client: TestClient, test_metrics, test_patterns):
    response = client.get('/api/monitoring/learning/system-health')
    assert response.status_code == 200
    data = response.json()
    
    # Verify response structure
    assert 'total_patterns' in data
    assert 'active_patterns' in data
    assert 'avg_success_rate' in data
    assert 'avg_confidence' in data
    assert 'total_agents' in data
    assert 'patterns_by_type' in data
    assert 'agent_health' in data
    assert 'recent_errors' in data
    
    # Verify calculations
    assert data['total_patterns'] == len(test_patterns)
    assert isinstance(data['avg_success_rate'], float)
    assert 0 <= data['avg_success_rate'] <= 1
    assert isinstance(data['avg_confidence'], float)
    assert 0 <= data['avg_confidence'] <= 1

def test_error_reporting(client: TestClient, db: Session):
    # Create test error metrics
    error_metrics = [
        LearningMetric(
            id=uuid4(),
            agent_id=str(uuid4()),
            metric_type='error',
            value=0.0,
            timestamp=datetime.utcnow() - timedelta(minutes=i*30),
            metadata={
                'error': f'Test error {i}',
                'context': {'test': 'data'}
            }
        )
        for i in range(5)  # 5 test errors
    ]
    
    for metric in error_metrics:
        db.add(metric)
    db.commit()
    
    # Test error retrieval in system health
    response = client.get('/api/monitoring/learning/system-health')
    assert response.status_code == 200
    data = response.json()
    
    # Verify errors are included and properly formatted
    assert 'recent_errors' in data
    errors = data['recent_errors']
    assert len(errors) == 5  # All test errors should be returned
    
    for error in errors:
        assert 'timestamp' in error
        assert 'agent_id' in error
        assert 'error' in error
        assert 'context' in error
        
        # Verify error is recent
        error_time = datetime.fromisoformat(error['timestamp'])
        assert datetime.utcnow() - error_time < timedelta(hours=3)

def test_pattern_type_aggregation(client: TestClient, db: Session):
    # Create patterns with different types
    pattern_types = ['type_a', 'type_b', 'type_c']
    test_patterns = [
        PatternMetric(
            id=uuid4(),
            agent_id=str(uuid4()),
            pattern_id=str(uuid4()),
            confidence=0.9,
            usage_count=10,
            success_rate=0.85,
            timestamp=datetime.utcnow(),
            metadata={'type': pattern_type}
        )
        for pattern_type in pattern_types
        for _ in range(3)  # 3 patterns of each type
    ]
    
    for pattern in test_patterns:
        db.add(pattern)
    db.commit()
    
    # Test pattern type aggregation in system health
    response = client.get('/api/monitoring/learning/system-health')
    assert response.status_code == 200
    data = response.json()
    
    # Verify pattern type aggregation
    assert 'patterns_by_type' in data
    type_counts = data['patterns_by_type']
    
    for pattern_type in pattern_types:
        assert pattern_type in type_counts
        assert type_counts[pattern_type] == 3

def test_agent_health_metrics(client: TestClient, db: Session):
    # Create test data for specific agent
    agent_id = str(uuid4())
    
    # Add metrics
    metrics = [
        LearningMetric(
            id=uuid4(),
            agent_id=agent_id,
            metric_type='performance',
            value=0.9,
            timestamp=datetime.utcnow() - timedelta(hours=i),
            metadata={'test': 'data'}
        )
        for i in range(5)
    ]
    
    # Add patterns
    patterns = [
        PatternMetric(
            id=uuid4(),
            agent_id=agent_id,
            pattern_id=str(uuid4()),
            confidence=0.85,
            usage_count=5,
            success_rate=0.8,
            timestamp=datetime.utcnow() - timedelta(hours=i),
            metadata={'type': 'test'}
        )
        for i in range(3)
    ]
    
    for item in metrics + patterns:
        db.add(item)
    db.commit()
    
    # Test agent health metrics
    response = client.get('/api/monitoring/learning/system-health')
    assert response.status_code == 200
    data = response.json()
    
    # Verify agent health metrics
    assert 'agent_health' in data
    agent_health = data['agent_health']
    assert agent_id in agent_health
    
    agent_metrics = agent_health[agent_id]
    assert agent_metrics['total_metrics'] == 5
    assert agent_metrics['total_patterns'] == 3
    assert 0 <= agent_metrics['avg_success_rate'] <= 1
    assert agent_metrics['last_active'] is not None