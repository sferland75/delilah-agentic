from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from datetime import datetime
from ..services.reporting_service import ReportingService, ReportConfig, ReportResult
from ..database import get_db

router = APIRouter()

@router.post("/reports/generate", response_model=ReportResult)
async def generate_report(
    config: ReportConfig,
    db = Depends(get_db),
    reporting_service: ReportingService = Depends(lambda: ReportingService(db))
):
    try:
        report = await reporting_service.generate_report(config)
        # Save report for future reference
        await reporting_service.save_report(report)
        return report
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/reports/{report_id}", response_model=ReportResult)
async def get_report(
    report_id: str,
    db = Depends(get_db),
    reporting_service: ReportingService = Depends(lambda: ReportingService(db))
):
    report = await reporting_service.get_report(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.get("/reports/", response_model=List[ReportResult])
async def list_reports(
    report_type: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    limit: Optional[int] = None,
    db = Depends(get_db),
    reporting_service: ReportingService = Depends(lambda: ReportingService(db))
):
    return await reporting_service.list_reports(report_type, start_date, end_date, limit)

@router.delete("/reports/{report_id}")
async def delete_report(
    report_id: str,
    db = Depends(get_db),
    reporting_service: ReportingService = Depends(lambda: ReportingService(db))
):
    success = await reporting_service.delete_report(report_id)
    if not success:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"message": "Report deleted successfully"}