from typing import Dict, Any, List
from .base_agent import BaseAgent
import logging

logger = logging.getLogger(__name__)

class AssessmentAgent(BaseAgent):
    def __init__(self, agent_id: str, config: Dict[str, Any]):
        super().__init__(agent_id, config)
        self.assessment_templates = {}
        self.current_assessment = None
        
    async def _analyze_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze assessment task"""
        assessment_type = task.get("assessment_type")
        client_data = task.get("client_data", {})
        
        analysis = {
            "assessment_type": assessment_type,
            "client_risk_factors": await self._identify_risk_factors(client_data),
            "recommended_tools": await self._determine_assessment_tools(assessment_type, client_data),
            "estimated_duration": await self._estimate_duration(assessment_type, client_data)
        }
        
        return analysis
        
    async def _create_plan(self, analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Create assessment execution plan"""
        plan = [
            {
                "step": "initialize_assessment",
                "params": {
                    "assessment_type": analysis["assessment_type"],
                    "tools": analysis["recommended_tools"]
                }
            },
            {
                "step": "gather_data",
                "params": {
                    "risk_factors": analysis["client_risk_factors"]
                }
            },
            {
                "step": "analyze_responses",
                "params": {}
            },
            {
                "step": "generate_report",
                "params": {
                    "include_risk_factors": True,
                    "include_recommendations": True
                }
            }
        ]
        
        return plan
        
    async def _execute_plan(self, plan: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Execute assessment plan"""
        results = {}
        
        for step in plan:
            step_name = step["step"]
            params = step["params"]
            
            if step_name == "initialize_assessment":
                results["initialization"] = await self._initialize_assessment(params)
            elif step_name == "gather_data":
                results["gathered_data"] = await self._gather_assessment_data(params)
            elif step_name == "analyze_responses":
                results["analysis"] = await self._analyze_responses(results["gathered_data"])
            elif step_name == "generate_report":
                results["report"] = await self._generate_assessment_report(results, params)
                
        return results
        
    async def _report_results(self, results: Dict[str, Any]):
        """Report assessment results"""
        # Implementation will vary based on reporting requirements
        report = results.get("report", {})
        
        # Store report in database
        # Notify relevant parties
        # Update client record
        pass
        
    async def _identify_risk_factors(self, client_data: Dict[str, Any]) -> List[str]:
        """Identify client risk factors"""
        risk_factors = []
        
        # Age-based risks
        age = client_data.get("age")
        if age and age < 25:
            risk_factors.append("young_adult")
            
        # History-based risks
        history = client_data.get("medical_history", [])
        if "previous_crisis" in history:
            risk_factors.append("crisis_history")
            
        # Support system risks
        support = client_data.get("support_system", {})
        if not support.get("family_support") and not support.get("social_support"):
            risk_factors.append("limited_support")
            
        return risk_factors
        
    async def _determine_assessment_tools(self, assessment_type: str, client_data: Dict[str, Any]) -> List[str]:
        """Determine appropriate assessment tools"""
        tools = []
        
        # Base tools for all assessments
        tools.append("basic_mental_health_screening")
        tools.append("life_satisfaction_scale")
        
        # Additional tools based on assessment type
        if assessment_type == "initial":
            tools.extend([
                "comprehensive_intake_form",
                "risk_assessment_checklist",
                "support_system_evaluation"
            ])
        elif assessment_type == "crisis":
            tools.extend([
                "crisis_severity_scale",
                "safety_plan_template",
                "immediate_needs_assessment"
            ])
        elif assessment_type == "follow_up":
            tools.extend([
                "progress_evaluation_form",
                "treatment_effectiveness_scale",
                "goal_achievement_checklist"
            ])
            
        # Additional tools based on risk factors
        risk_factors = client_data.get("risk_factors", [])
        if "suicidal_ideation" in risk_factors:
            tools.append("suicide_risk_assessment")
        if "substance_use" in risk_factors:
            tools.append("substance_use_screening")
            
        return tools
        
    async def _estimate_duration(self, assessment_type: str, client_data: Dict[str, Any]) -> int:
        """Estimate assessment duration in minutes"""
        base_duration = {
            "initial": 90,
            "crisis": 60,
            "follow_up": 45
        }.get(assessment_type, 60)
        
        # Adjust for risk factors
        risk_factors = client_data.get("risk_factors", [])
        risk_adjustment = len(risk_factors) * 15
        
        # Adjust for language barriers
        if client_data.get("needs_interpreter"):
            base_duration *= 1.5
            
        return int(base_duration + risk_adjustment)
        
    async def _initialize_assessment(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Initialize new assessment"""
        assessment_type = params["assessment_type"]
        tools = params["tools"]
        
        assessment = {
            "type": assessment_type,
            "tools": tools,
            "start_time": None,
            "responses": {},
            "status": "initialized"
        }
        
        self.current_assessment = assessment
        return assessment
        
    async def _gather_assessment_data(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Gather assessment data using selected tools"""
        if not self.current_assessment:
            raise ValueError("No active assessment")
            
        gathered_data = {
            "responses": {},
            "observations": {},
            "metrics": {}
        }
        
        for tool in self.current_assessment["tools"]:
            tool_data = await self._collect_tool_data(tool, params)
            gathered_data["responses"][tool] = tool_data
            
        return gathered_data
        
    async def _analyze_responses(self, gathered_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze assessment responses"""
        analysis = {
            "risk_levels": {},
            "key_concerns": [],
            "recommendations": [],
            "follow_up_needed": False
        }
        
        # Analyze responses for each tool
        for tool, responses in gathered_data["responses"].items():
            tool_analysis = await self._analyze_tool_responses(tool, responses)
            analysis["risk_levels"][tool] = tool_analysis.get("risk_level")
            analysis["key_concerns"].extend(tool_analysis.get("concerns", []))
            analysis["recommendations"].extend(tool_analysis.get("recommendations", []))
            
        # Determine if follow-up is needed
        analysis["follow_up_needed"] = any(
            level in ["high", "severe"] 
            for level in analysis["risk_levels"].values()
        )
        
        return analysis
        
    async def _analyze_tool_responses(self, tool: str, responses: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze responses for a specific assessment tool"""
        # Implementation will vary based on tool type
        return {
            "risk_level": "low",
            "concerns": [],
            "recommendations": []
        }
        
    async def _generate_assessment_report(self, results: Dict[str, Any], params: Dict[str, Any]) -> Dict[str, Any]:
        """Generate assessment report"""
        report = {
            "summary": {
                "assessment_type": self.current_assessment["type"],
                "tools_used": self.current_assessment["tools"],
                "overall_risk_level": self._determine_overall_risk(results["analysis"]["risk_levels"])
            },
            "risk_factors": results["analysis"]["key_concerns"] if params.get("include_risk_factors") else [],
            "recommendations": results["analysis"]["recommendations"] if params.get("include_recommendations") else [],
            "follow_up": {
                "needed": results["analysis"]["follow_up_needed"],
                "timeframe": "1 week" if results["analysis"]["follow_up_needed"] else "as scheduled"
            }
        }
        
        return report
        
    def _determine_overall_risk(self, risk_levels: Dict[str, str]) -> str:
        """Determine overall risk level from individual tool risk levels"""
        risk_hierarchy = ["low", "moderate", "high", "severe"]
        highest_risk = "low"
        
        for risk in risk_levels.values():
            if risk_hierarchy.index(risk) > risk_hierarchy.index(highest_risk):
                highest_risk = risk
                
        return highest_risk