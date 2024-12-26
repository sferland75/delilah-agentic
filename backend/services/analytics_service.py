from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
from collections import defaultdict

class TimeframeMetrics(BaseModel):
    total_assessments: int
    completed_assessments: int
    completion_rate: float
    average_score: float
    average_completion_time: float

class TherapistMetrics(BaseModel):
    assessments_assigned: int
    assessments_completed: int
    average_review_time: float
    patient_count: int
    average_patient_score: float

class PatientMetrics(BaseModel):
    assessment_count: int
    completion_rate: float
    average_score: float
    score_trend: List[float]
    last_assessment_date: Optional[datetime]

class AnalyticsService:
    def __init__(self, db_session):
        self.db = db_session

    async def get_dashboard_metrics(
        self,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Get main dashboard metrics"""
        if not start_date:
            start_date = datetime.utcnow() - timedelta(days=30)
        if not end_date:
            end_date = datetime.utcnow()

        # Here we would fetch from database
        # For now, returning mock data
        return {
            "overview": {
                "total_assessments": 150,
                "active_patients": 45,
                "active_therapists": 8,
                "pending_reviews": 12
            },
            "completion_rates": {
                "last_7_days": 85.5,
                "last_30_days": 82.3,
                "last_90_days": 80.1
            },
            "score_distribution": {
                "high": 35,
                "medium": 95,
                "low": 20
            },
            "trends": {
                "assessments_per_day": self._generate_trend_data(30),
                "average_scores": self._generate_trend_data(30, min_value=70, max_value=90),
                "completion_times": self._generate_trend_data(30, min_value=20, max_value=60)
            }
        }

    async def get_timeframe_metrics(
        self,
        start_date: datetime,
        end_date: datetime
    ) -> TimeframeMetrics:
        """Get metrics for a specific timeframe"""
        # Here we would calculate from database
        # For now, returning mock data
        return TimeframeMetrics(
            total_assessments=100,
            completed_assessments=85,
            completion_rate=85.0,
            average_score=82.5,
            average_completion_time=45.0
        )

    async def get_therapist_metrics(
        self,
        therapist_id: str,
        timeframe_days: int = 30
    ) -> TherapistMetrics:
        """Get metrics for a specific therapist"""
        # Here we would calculate from database
        # For now, returning mock data
        return TherapistMetrics(
            assessments_assigned=25,
            assessments_completed=20,
            average_review_time=30.5,
            patient_count=12,
            average_patient_score=84.2
        )

    async def get_patient_metrics(
        self,
        patient_id: str,
        timeframe_days: int = 90
    ) -> PatientMetrics:
        """Get metrics for a specific patient"""
        # Here we would calculate from database
        # For now, returning mock data
        return PatientMetrics(
            assessment_count=8,
            completion_rate=87.5,
            average_score=83.4,
            score_trend=[75.0, 78.5, 80.0, 82.5, 83.4],
            last_assessment_date=datetime.utcnow() - timedelta(days=7)
        )

    async def get_assessment_completion_times(
        self,
        start_date: datetime,
        end_date: datetime
    ) -> Dict[str, float]:
        """Get average completion times by template type"""
        # Here we would calculate from database
        # For now, returning mock data
        return {
            "template_1": 35.5,
            "template_2": 42.3,
            "template_3": 28.7
        }

    async def get_score_distributions(
        self,
        start_date: datetime,
        end_date: datetime,
        group_by: str = 'template'
    ) -> Dict[str, Dict[str, int]]:
        """Get score distributions grouped by specified parameter"""
        # Here we would calculate from database
        # For now, returning mock data
        return {
            "template_1": {
                "high": 15,
                "medium": 45,
                "low": 10
            },
            "template_2": {
                "high": 20,
                "medium": 30,
                "low": 5
            }
        }

    def _generate_trend_data(
        self,
        days: int,
        min_value: float = 0,
        max_value: float = 100
    ) -> List[Dict[str, Any]]:
        """Generate mock trend data"""
        import random
        from datetime import datetime, timedelta

        data = []
        start_date = datetime.utcnow() - timedelta(days=days)
        
        for day in range(days):
            current_date = start_date + timedelta(days=day)
            value = random.uniform(min_value, max_value)
            data.append({
                "date": current_date.isoformat(),
                "value": round(value, 2)
            })
        
        return data