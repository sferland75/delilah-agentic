from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.exc import SQLAlchemyError
from typing import Dict, Any, Optional
from uuid import UUID

from api.services.report.service import ReportService
from api.deps import get_report_service

router = APIRouter()

@router.post("/{assessment_id}",
    response_model=Dict[str, Any],
    status_code=status.HTTP_201_CREATED,
    description="Generate a report for an assessment"
)
async def generate_report(
    assessment_id: UUID,
    report_type: str = Query(..., description="Type of report to generate"),
    template_type: Optional[str] = Query(None, description="Optional template type override"),
    service: ReportService = Depends(get_report_service)
):
    """
    Generate a report from assessment data:
    - Retrieves assessment and analysis data
    - Generates formatted report sections
    - Creates database record
    - Returns complete report data
    """
    try:
        report = await service.generate_report(
            assessment_id=assessment_id,
            report_type=report_type,
            template_type=template_type
        )
        return {
            "id": report["id"],
            "status": "created",
            "message": "Report generated successfully",
            "content": report["content"]
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.get("/{report_id}",
    response_model=Dict[str, Any],
    description="Get report by ID"
)
async def get_report(
    report_id: UUID,
    service: ReportService = Depends(get_report_service)
):
    """
    Retrieve a report by ID:
    - Checks both active reports and database
    - Returns complete report data with metadata
    """
    try:
        report = await service.get_report(report_id)
        if not report:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Report not found"
            )
        return report
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.post("/{report_id}/finalize",
    response_model=Dict[str, Any],
    description="Finalize report for signing"
)
async def finalize_report(
    report_id: UUID,
    service: ReportService = Depends(get_report_service)
):
    """
    Finalize a report for signing:
    - Updates report status
    - Adds finalization metadata
    - Returns updated report data
    """
    try:
        report = await service.finalize_report(report_id)
        return {
            "id": report["id"],
            "status": "finalized",
            "message": "Report finalized successfully",
            "finalized_at": report["metadata"]["finalized_at"]
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )