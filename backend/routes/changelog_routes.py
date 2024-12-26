from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from datetime import datetime
from services.changelog_service import ChangelogService, ChangelogEntry
from database import get_db

router = APIRouter()

@router.get("/changelog/assessment/{assessment_id}", response_model=List[ChangelogEntry])
async def get_assessment_history(
    assessment_id: str,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db = Depends(get_db),
    changelog_service: ChangelogService = Depends(lambda: ChangelogService(db))
):
    return await changelog_service.get_assessment_history(assessment_id, start_date, end_date)

@router.get("/changelog/user/{user_id}", response_model=List[ChangelogEntry])
async def get_user_activity(
    user_id: str,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db = Depends(get_db),
    changelog_service: ChangelogService = Depends(lambda: ChangelogService(db))
):
    return await changelog_service.get_user_activity(user_id, start_date, end_date)