from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from uuid import uuid4
from pydantic import BaseModel

class ReportConfig(BaseModel):
    id: str
    name: str
    type: str  # 'assessment', 'patient', 'therapist', 'summary'
    filters: Dict[str, Any]
    grouping: Optional[List[str]] = None
    metrics: List[str]
    sort_by: Optional[str] = None
    sort_order: Optional[str] = 'asc'
    limit: Optional[int] = None

class ReportResult(BaseModel):
    id: str
    config_id: str
    generated_at: datetime
    data: List[Dict[str, Any]]
    summary: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None

class ReportingService:
    def __init__(self, db_session):
        self.db = db_session

    async def generate_report(self, config: ReportConfig) -> ReportResult:
        """Generate a report based on the provided configuration"""
        if config.type == 'assessment':
            data = await self._generate_assessment_report(config)
        elif config.type == 'patient':
            data = await self._generate_patient_report(config)
        elif config.type == 'therapist':
            data = await self._generate_therapist_report(config)
        elif config.type == 'summary':
            data = await self._generate_summary_report(config)
        else:
            raise ValueError(f"Unsupported report type: {config.type}")

        summary = await self._calculate_summary(data, config.metrics)

        return ReportResult(
            id=str(uuid4()),
            config_id=config.id,
            generated_at=datetime.utcnow(),
            data=data,
            summary=summary
        )

    async def _generate_assessment_report(self, config: ReportConfig) -> List[Dict[str, Any]]:
        """Generate report data for assessments"""
        filters = config.filters
        query = []

        if filters.get('date_range'):
            start_date = datetime.fromisoformat(filters['date_range']['start'])
            end_date = datetime.fromisoformat(filters['date_range']['end'])
            query.append({"created_at": {"$gte": start_date, "$lte": end_date}})

        if filters.get('status'):
            query.append({"status": filters['status']})

        if filters.get('template_id'):
            query.append({"template_id": filters['template_id']})

        # Here we would fetch from database using query
        # For now, returning mock data
        return [{
            "id": "mock_assessment_1",
            "created_at": datetime.utcnow(),
            "status": "completed",
            "score": 85.5,
            "patient_id": "patient_1",
            "therapist_id": "therapist_1",
            "metrics": {
                "completion_time": 45,
                "score_improvement": 15.5,
                "review_time": 20
            }
        }]

    async def _generate_patient_report(self, config: ReportConfig) -> List[Dict[str, Any]]:
        """Generate report data for patients"""
        # Here we would fetch patient data from database
        # For now, returning mock data
        return [{
            "id": "patient_1",
            "name": "John Doe",
            "assessments_count": 5,
            "average_score": 82.5,
            "progress": 15.5,
            "last_assessment": datetime.utcnow() - timedelta(days=7)
        }]

    async def _generate_therapist_report(self, config: ReportConfig) -> List[Dict[str, Any]]:
        """Generate report data for therapists"""
        # Here we would fetch therapist data from database
        # For now, returning mock data
        return [{
            "id": "therapist_1",
            "name": "Dr. Smith",
            "assessments_completed": 25,
            "average_review_time": 30,
            "patients_count": 12,
            "average_patient_score": 84.2
        }]

    async def _generate_summary_report(self, config: ReportConfig) -> List[Dict[str, Any]]:
        """Generate summary report data"""
        # Here we would generate summary statistics
        # For now, returning mock data
        return [{
            "total_assessments": 150,
            "active_patients": 45,
            "average_completion_time": 35,
            "average_score": 83.7,
            "score_distribution": {
                "high": 35,
                "medium": 95,
                "low": 20
            }
        }]

    async def _calculate_summary(
        self,
        data: List[Dict[str, Any]],
        metrics: List[str]
    ) -> Dict[str, Any]:
        """Calculate summary statistics for the report data"""
        summary = {}

        for metric in metrics:
            values = [item.get(metric) for item in data if item.get(metric) is not None]
            if values:
                summary[metric] = {
                    'average': sum(values) / len(values),
                    'min': min(values),
                    'max': max(values),
                    'count': len(values)
                }

        return summary

    async def save_report(self, report: ReportResult) -> str:
        """Save generated report to database"""
        # Here we would save to database
        # For now, returning mock ID
        return report.id

    async def get_report(self, report_id: str) -> Optional[ReportResult]:
        """Retrieve a saved report"""
        # Here we would fetch from database
        # For now, returning None
        return None

    async def list_reports(
        self,
        report_type: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: Optional[int] = None
    ) -> List[ReportResult]:
        """List saved reports with optional filtering"""
        # Here we would fetch from database with filters
        # For now, returning empty list
        return []

    async def delete_report(self, report_id: str) -> bool:
        """Delete a saved report"""
        # Here we would delete from database
        # For now, returning mock success
        return True