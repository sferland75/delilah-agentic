from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from typing import Dict, Any, Optional
from uuid import UUID

from database.models import Assessment
from agents.analysis_agent import AnalysisAgent, AssessmentAnalysis

class AnalysisService:
    def __init__(self, db: Session):
        self.db = db
        self.agent = AnalysisAgent()
    
    async def analyze_assessment(self, assessment_id: UUID) -> AssessmentAnalysis:
        """Analyze an assessment and generate insights"""
        try:
            # Get assessment data
            assessment = await self.db.query(Assessment).filter(Assessment.id == assessment_id).first()
            if not assessment:
                raise ValueError("Assessment not found")
                
            # Get previous assessment if exists
            previous_assessment = await self._get_previous_assessment(
                client_id=assessment.client_id,
                current_assessment_id=assessment_id
            )
            
            # Prepare analysis data
            analysis_data = {
                **assessment.data,
                "previous_assessment": previous_assessment.data if previous_assessment else None
            }
            
            # Run analysis
            analysis = await self.agent.analyze_assessment(
                session_id=assessment_id,
                assessment_data=analysis_data
            )
            
            # Update assessment with analysis results
            assessment.data["analysis"] = {
                "functional_scores": analysis.functional_scores,
                "risk_factors": analysis.risk_factors,
                "recommendations": analysis.recommendations,
                "intervention_priorities": analysis.intervention_priorities,
                "goal_progress": analysis.goal_progress,
                "timestamp": analysis.timestamp.isoformat()
            }
            assessment.updated_at = datetime.utcnow()
            
            await self.db.commit()
            await self.db.refresh(assessment)
            
            return analysis
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise e
    
    async def get_analysis(self, assessment_id: UUID) -> Optional[Dict[str, Any]]:
        """Get analysis results for an assessment"""
        try:
            assessment = await self.db.query(Assessment).filter(Assessment.id == assessment_id).first()
            if not assessment or "analysis" not in assessment.data:
                return None
            return assessment.data["analysis"]
        except SQLAlchemyError as e:
            raise e
    
    async def _get_previous_assessment(
        self,
        client_id: UUID,
        current_assessment_id: UUID
    ) -> Optional[Assessment]:
        """Get the most recent previous assessment for the client"""
        try:
            return await self.db.query(Assessment)\
                .filter(
                    Assessment.client_id == client_id,
                    Assessment.id != current_assessment_id,
                    Assessment.status == "completed"
                )\
                .order_by(Assessment.created_at.desc())\
                .first()
        except SQLAlchemyError as e:
            raise e