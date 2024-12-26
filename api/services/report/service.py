from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from typing import Dict, Any, Optional
from uuid import UUID

from database.models import Assessment, Report
from agents.report_agent import ReportAgent

class ReportService:
    def __init__(self, db: Session):
        self.db = db
        self.agent = ReportAgent()

    async def generate_report(
        self,
        assessment_id: UUID,
        report_type: str,
        template_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate a report for an assessment"""
        try:
            # Get assessment and analysis data
            assessment = await self.db.query(Assessment).filter(Assessment.id == assessment_id).first()
            if not assessment:
                raise ValueError("Assessment not found")

            if "analysis" not in assessment.data:
                raise ValueError("Assessment has not been analyzed")

            # Generate report using agent
            report_data = await self.agent.generate_report(
                session_id=assessment_id,
                report_type=report_type,
                assessment_data=assessment.data,
                analysis_results=assessment.data["analysis"],
                template_type=template_type
            )

            # Create database record
            db_report = Report(
                id=report_data["id"],
                assessment_id=assessment_id,
                content=report_data["content"],
                summary=self._generate_summary(report_data),
                recommendations=report_data["content"].get("recommendations", {}).get("treatment_recommendations", [])
            )

            self.db.add(db_report)
            await self.db.commit()
            await self.db.refresh(db_report)

            return report_data

        except SQLAlchemyError as e:
            await self.db.rollback()
            raise e

    async def get_report(self, report_id: UUID) -> Optional[Dict[str, Any]]:
        """Get report by ID"""
        try:
            # Check agent's active reports
            agent_report = await self.agent.get_report(report_id)
            if agent_report:
                return agent_report

            # Check database
            db_report = await self.db.query(Report).filter(Report.id == report_id).first()
            if not db_report:
                return None

            return {
                "id": db_report.id,
                "content": db_report.content,
                "summary": db_report.summary,
                "recommendations": db_report.recommendations,
                "created_at": db_report.created_at.isoformat(),
                "updated_at": db_report.updated_at.isoformat() if db_report.updated_at else None
            }

        except SQLAlchemyError as e:
            raise e

    async def finalize_report(self, report_id: UUID) -> Dict[str, Any]:
        """Finalize a report for signing"""
        try:
            # Finalize in agent
            report_data = await self.agent.finalize_report(report_id)

            # Update database
            db_report = await self.db.query(Report).filter(Report.id == report_id).first()
            if not db_report:
                raise ValueError("Report not found in database")

            db_report.content = report_data["content"]
            db_report.updated_at = datetime.utcnow()
            db_report.metadata = {
                **(db_report.metadata or {}),
                "finalized_at": report_data["metadata"]["finalized_at"].isoformat()
            }

            await self.db.commit()
            await self.db.refresh(db_report)

            return report_data

        except SQLAlchemyError as e:
            await self.db.rollback()
            raise e

    def _generate_summary(self, report_data: Dict[str, Any]) -> str:
        """Generate a summary of the report content"""
        content = report_data["content"]
        summary_parts = []

        if "assessment_summary" in content:
            summary_parts.append("Assessment Summary: " + 
                self._summarize_section(content["assessment_summary"]))

        if "analysis_findings" in content:
            summary_parts.append("Key Findings: " + 
                self._summarize_section(content["analysis_findings"]))

        if "recommendations" in content:
            summary_parts.append("Recommendations: " + 
                self._summarize_section(content["recommendations"]))

        return "\n\n".join(summary_parts)

    def _summarize_section(self, section: Dict[str, Any]) -> str:
        """Create a text summary of a report section"""
        if isinstance(section, dict):
            # Extract main points from the section
            main_points = []
            for key, value in section.items():
                if isinstance(value, list) and value:
                    main_points.extend(value[:3])  # Take first 3 items
                elif isinstance(value, str):
                    main_points.append(value)
            return "; ".join(main_points[:3])  # Limit to 3 main points
        return str(section)