from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from uuid import UUID

from app.database.database import get_db
from app.models.report import Report
from app.models.assessment import Assessment
from app.schemas.report import (
    ReportCreate,
    ReportResponse,
    ReportUpdate
)

router = APIRouter(prefix="/reports", tags=["reports"])

@router.post("/", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
async def create_report(
    report: ReportCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new report"""
    # Verify assessment exists and is completed
    assessment_query = select(Assessment).where(Assessment.id == report.assessment_id)
    result = await db.execute(assessment_query)
    assessment = result.scalar_one_or_none()
    
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    if assessment.status != "COMPLETED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create report for incomplete assessment"
        )

    # Check if report already exists for this assessment
    existing_query = select(Report).where(Report.assessment_id == report.assessment_id)
    existing = await db.execute(existing_query)
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Report already exists for this assessment"
        )

    db_report = Report(
        assessment_id=report.assessment_id,
        content=report.content.dict(),
        summary=report.summary,
        recommendations=[rec.dict() for rec in report.recommendations]
    )
    
    db.add(db_report)
    await db.commit()
    await db.refresh(db_report)
    return db_report

@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a report by ID"""
    query = select(Report).where(Report.id == report_id)
    result = await db.execute(query)
    report = result.scalar_one_or_none()
    
    if report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    return report

@router.get("/assessment/{assessment_id}", response_model=ReportResponse)
async def get_report_by_assessment(
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a report by assessment ID"""
    query = select(Report).where(Report.assessment_id == assessment_id)
    result = await db.execute(query)
    report = result.scalar_one_or_none()
    
    if report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found for this assessment"
        )
    return report

@router.get("/", response_model=List[ReportResponse])
async def list_reports(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """List all reports with pagination"""
    query = select(Report).offset(skip).limit(limit)
    result = await db.execute(query)
    reports = result.scalars().all()
    return reports

@router.patch("/{report_id}", response_model=ReportResponse)
async def update_report(
    report_id: UUID,
    report_update: ReportUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a report"""
    query = select(Report).where(Report.id == report_id)
    result = await db.execute(query)
    db_report = result.scalar_one_or_none()
    
    if db_report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    update_data = report_update.dict(exclude_unset=True)
    
    # Handle nested updates
    if "content" in update_data and update_data["content"]:
        current_content = db_report.content or {}
        current_content.update(update_data["content"].dict(exclude_unset=True))
        update_data["content"] = current_content
    
    if "recommendations" in update_data and update_data["recommendations"]:
        update_data["recommendations"] = [rec.dict() for rec in update_data["recommendations"]]
    
    for field, value in update_data.items():
        setattr(db_report, field, value)
    
    await db.commit()
    await db.refresh(db_report)
    return db_report

@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_report(
    report_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete a report"""
    query = select(Report).where(Report.id == report_id)
    result = await db.execute(query)
    report = result.scalar_one_or_none()
    
    if report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    await db.delete(report)
    await db.commit()
    return None