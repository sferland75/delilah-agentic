from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from typing import Dict, Any
from uuid import UUID

from api.services.analysis.service import AnalysisService
from api.deps import get_analysis_service

router = APIRouter()

@router.post("/{assessment_id}",
    response_model=Dict[str, Any],
    description="Analyze assessment data"
)
async def analyze_assessment(
    assessment_id: UUID,
    service: AnalysisService = Depends(get_analysis_service)
):
    """
    Analyze assessment data and generate insights:
    - Functional scores
    - Risk factors
    - Recommendations
    - Intervention priorities
    - Goal progress (if follow-up assessment)
    """
    try:
        analysis = await service.analyze_assessment(assessment_id)
        return {
            "functional_scores": analysis.functional_scores,
            "risk_factors": analysis.risk_factors,
            "recommendations": analysis.recommendations,
            "intervention_priorities": analysis.intervention_priorities,
            "goal_progress": analysis.goal_progress,
            "timestamp": analysis.timestamp
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

@router.get("/{assessment_id}",
    response_model=Dict[str, Any],
    description="Get analysis results"
)
async def get_analysis(
    assessment_id: UUID,
    service: AnalysisService = Depends(get_analysis_service)
):
    """
    Retrieve analysis results for an assessment
    """
    try:
        analysis = await service.get_analysis(assessment_id)
        if not analysis:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Analysis not found"
            )
        return analysis
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )