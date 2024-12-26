from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from datetime import datetime
from ..services.analytics_service import AnalyticsService
from ..database import get_db

router = APIRouter()

@router.get("/analytics/dashboard")
async def get_dashboard_metrics(
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db = Depends(get_db),
    analytics_service: AnalyticsService = Depends(lambda: AnalyticsService(db))
):
    return await analytics_service.get_dashboard_metrics(start_date, end_date)

@router.get("/analytics/timeframe")
async def get_timeframe_metrics(
    start_date: datetime,
    end_date: datetime,
    db = Depends(get_db),
    analytics_service: AnalyticsService = Depends(lambda: AnalyticsService(db))
):
    return await analytics_service.get_timeframe_metrics(start_date, end_date)

@router.get("/analytics/therapist/{therapist_id}")
async def get_therapist_metrics(
    therapist_id: str,
    timeframe_days: int = 30,
    db = Depends(get_db),
    analytics_service: AnalyticsService = Depends(lambda: AnalyticsService(db))
):
    return await analytics_service.get_therapist_metrics(therapist_id, timeframe_days)

@router.get("/analytics/patient/{patient_id}")
async def get_patient_metrics(
    patient_id: str,
    timeframe_days: int = 90,
    db = Depends(get_db),
    analytics_service: AnalyticsService = Depends(lambda: AnalyticsService(db))
):
    return await analytics_service.get_patient_metrics(patient_id, timeframe_days)

@router.get("/analytics/completion-times")
async def get_completion_times(
    start_date: datetime,
    end_date: datetime,
    db = Depends(get_db),
    analytics_service: AnalyticsService = Depends(lambda: AnalyticsService(db))
):
    return await analytics_service.get_assessment_completion_times(start_date, end_date)

@router.get("/analytics/score-distributions")
async def get_score_distributions(
    start_date: datetime,
    end_date: datetime,
    group_by: str = 'template',
    db = Depends(get_db),
    analytics_service: AnalyticsService = Depends(lambda: AnalyticsService(db))
):
    return await analytics_service.get_score_distributions(start_date, end_date, group_by)