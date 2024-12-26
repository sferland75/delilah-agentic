import asyncio
from typing import Dict, Any, Optional, List
from uuid import UUID
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class ReportTemplate:
    def __init__(self, template_type: str):
        self.sections = {
            "initial_evaluation": [
                "client_information",
                "assessment_summary",
                "functional_status",
                "analysis_findings",
                "risk_assessment",
                "recommendations",
                "treatment_plan",
                "goals"
            ],
            "progress_note": [
                "session_information",
                "progress_update",
                "goal_progress",
                "treatment_modifications",
                "plan_for_next_session"
            ],
            "discharge_summary": [
                "treatment_summary",
                "outcomes_achieved",
                "final_status",
                "follow_up_recommendations",
                "home_program"
            ]
        }
        self.required_fields = {
            "initial_evaluation": [
                "client_id",
                "therapist_id",
                "assessment_data",
                "analysis_results"
            ],
            "progress_note": [
                "client_id",
                "therapist_id",
                "session_data",
                "progress_data"
            ],
            "discharge_summary": [
                "client_id",
                "therapist_id",
                "treatment_history",
                "final_assessment"
            ]
        }
        self.template_type = template_type

class ReportAgent:
    def __init__(self):
        self.message_queue: asyncio.Queue = asyncio.Queue()
        self.active_reports: Dict[UUID, Dict[str, Any]] = {}

    async def generate_report(
        self,
        session_id: UUID,
        report_type: str,
        assessment_data: Dict[str, Any],
        analysis_results: Dict[str, Any],
        template_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate a report from assessment and analysis data"""
        try:
            # Select template
            template = ReportTemplate(template_type or report_type)
            
            # Validate required data
            self._validate_required_fields(
                template,
                assessment_data,
                analysis_results
            )
            
            # Generate report sections
            sections = {}
            for section in template.sections[template.template_type]:
                section_content = await self._generate_section(
                    section,
                    assessment_data,
                    analysis_results
                )
                sections[section] = section_content
            
            # Create report structure
            report = {
                "id": UUID(int=len(self.active_reports) + 1),
                "session_id": session_id,
                "type": report_type,
                "content": sections,
                "metadata": {
                    "generated_at": datetime.utcnow(),
                    "template_type": template.template_type,
                    "version": "1.0"
                },
                "status": "draft"
            }
            
            self.active_reports[report["id"]] = report
            
            # Notify that report has been generated
            await self.message_queue.put({
                "type": "report_generated",
                "report_id": report["id"],
                "session_id": session_id,
                "timestamp": datetime.utcnow()
            })
            
            return report
        except Exception as e:
            logger.error(f"Error generating report: {str(e)}")
            raise

    async def _generate_section(
        self,
        section: str,
        assessment_data: Dict[str, Any],
        analysis_results: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate content for a specific report section"""
        try:
            if section == "client_information":
                return self._format_client_info(assessment_data)
            elif section == "assessment_summary":
                return self._format_assessment_summary(assessment_data)
            elif section == "functional_status":
                return self._format_functional_status(assessment_data, analysis_results)
            elif section == "analysis_findings":
                return self._format_analysis_findings(analysis_results)
            elif section == "risk_assessment":
                return self._format_risk_assessment(analysis_results)
            elif section == "recommendations":
                return self._format_recommendations(analysis_results)
            elif section == "treatment_plan":
                return self._format_treatment_plan(analysis_results)
            elif section == "goals":
                return self._format_goals(assessment_data, analysis_results)
            else:
                return {"content": "Section not implemented"}
        except Exception as e:
            logger.error(f"Error generating section {section}: {str(e)}")
            raise

    def _validate_required_fields(
        self,
        template: ReportTemplate,
        assessment_data: Dict[str, Any],
        analysis_results: Dict[str, Any]
    ) -> None:
        """Validate that all required fields are present"""
        required = template.required_fields[template.template_type]
        missing = []
        
        for field in required:
            if field.startswith("assessment_") and not assessment_data:
                missing.append(field)
            elif field.startswith("analysis_") and not analysis_results:
                missing.append(field)
                
        if missing:
            raise ValueError(f"Missing required fields: {', '.join(missing)}")

    def _format_client_info(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Format client information section"""
        return {
            "name": f"{data.get('client_name', 'Unknown')}",
            "demographics": {
                "date_of_birth": data.get("date_of_birth", "Unknown"),
                "gender": data.get("gender", "Not specified"),
                "contact": data.get("contact_info", {})
            },
            "referral_info": {
                "referral_date": data.get("referral_date", "Unknown"),
                "referral_source": data.get("referral_source", "Unknown"),
                "reason_for_referral": data.get("referral_reason", "Not specified")
            }
        }

    def _format_assessment_summary(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Format assessment summary section"""
        return {
            "date": data.get("assessment_date", datetime.utcnow().isoformat()),
            "type": data.get("assessment_type", "Unknown"),
            "presenting_concerns": data.get("presenting_concerns", []),
            "medical_history": data.get("medical_history", {}),
            "current_medications": data.get("medications", [])
        }

    def _format_functional_status(
        self,
        assessment_data: Dict[str, Any],
        analysis_results: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Format functional status section"""
        return {
            "adl_status": {
                "scores": analysis_results.get("functional_scores", {}).get("adl_independence", {}),
                "observations": assessment_data.get("adl_observations", [])
            },
            "mobility_status": {
                "scores": analysis_results.get("functional_scores", {}).get("mobility", {}),
                "observations": assessment_data.get("mobility_observations", [])
            },
            "cognitive_status": {
                "scores": analysis_results.get("functional_scores", {}).get("cognitive_function", {}),
                "observations": assessment_data.get("cognitive_observations", [])
            }
        }

    def _format_analysis_findings(self, analysis_results: Dict[str, Any]) -> Dict[str, Any]:
        """Format analysis findings section"""
        return {
            "key_findings": analysis_results.get("key_findings", []),
            "functional_scores": analysis_results.get("functional_scores", {}),
            "areas_of_concern": analysis_results.get("areas_of_concern", []),
            "strengths": analysis_results.get("strengths", [])
        }

    def _format_risk_assessment(self, analysis_results: Dict[str, Any]) -> Dict[str, Any]:
        """Format risk assessment section"""
        return {
            "identified_risks": analysis_results.get("risk_factors", []),
            "risk_levels": analysis_results.get("risk_levels", {}),
            "precautions": analysis_results.get("precautions", []),
            "safety_recommendations": analysis_results.get("safety_recommendations", [])
        }

    def _format_recommendations(self, analysis_results: Dict[str, Any]) -> Dict[str, Any]:
        """Format recommendations section"""
        return {
            "treatment_recommendations": analysis_results.get("recommendations", []),
            "priorities": analysis_results.get("intervention_priorities", []),
            "frequency": analysis_results.get("recommended_frequency", "As determined by protocol"),
            "duration": analysis_results.get("recommended_duration", "To be determined based on progress")
        }

    def _format_treatment_plan(self, analysis_results: Dict[str, Any]) -> Dict[str, Any]:
        """Format treatment plan section"""
        return {
            "treatment_approaches": analysis_results.get("treatment_approaches", []),
            "interventions": analysis_results.get("recommended_interventions", []),
            "outcome_measures": analysis_results.get("outcome_measures", []),
            "progression_criteria": analysis_results.get("progression_criteria", [])
        }

    def _format_goals(
        self,
        assessment_data: Dict[str, Any],
        analysis_results: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Format goals section"""
        return {
            "long_term_goals": assessment_data.get("long_term_goals", []),
            "short_term_goals": assessment_data.get("short_term_goals", []),
            "goal_timeline": analysis_results.get("goal_timeline", {}),
            "progress_indicators": analysis_results.get("progress_indicators", [])
        }

    async def finalize_report(self, report_id: UUID) -> Dict[str, Any]:
        """Finalize a report for signing"""
        if report_id not in self.active_reports:
            raise ValueError("Report not found")
            
        report = self.active_reports[report_id]
        if report["status"] == "finalized":
            raise ValueError("Report already finalized")
            
        report["status"] = "finalized"
        report["metadata"]["finalized_at"] = datetime.utcnow()
        
        await self.message_queue.put({
            "type": "report_finalized",
            "report_id": report_id,
            "session_id": report["session_id"],
            "timestamp": datetime.utcnow()
        })
        
        return report

    async def get_report(self, report_id: UUID) -> Optional[Dict[str, Any]]:
        """Retrieve a report by ID"""
        return self.active_reports.get(report_id)