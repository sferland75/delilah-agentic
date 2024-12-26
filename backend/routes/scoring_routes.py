from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from ..services.scoring_service import ScoringService, ScoringResult
from ..database import get_db

router = APIRouter()

@router.post("/scoring/assessment/{assessment_id}")
async def score_assessment(
    assessment_id: str,
    db = Depends(get_db),
    scoring_service: ScoringService = Depends(lambda: ScoringService(db))
):
    try:
        # Here we would fetch assessment data and template_id
        assessment_data = {}  # Fetch from database
        template_id = ""  # Get from assessment data
        
        scoring_result = await scoring_service.score_assessment(
            assessment_data,
            template_id
        )
        return scoring_result
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

@router.get("/scoring/assessment/{assessment_id}/score")
async def get_assessment_score(
    assessment_id: str,
    db = Depends(get_db)
):
    # Here we would fetch stored score
    # For now, returning mock data
    return {
        "total_score": 75.5,
        "score_label": "High",
        "section_scores": {
            "section1": 80.0,
            "section2": 71.0
        }
    }

@router.post("/scoring/template/{template_id}/rules")
async def update_scoring_rules(
    template_id: str,
    rules: Dict[str, Any],
    db = Depends(get_db)
):
    # Here we would update template scoring rules
    # For now, returning success response
    return {"message": "Scoring rules updated successfully"}