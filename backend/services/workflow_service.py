from typing import Dict, List, Optional, Set
from datetime import datetime
from enum import Enum
from pydantic import BaseModel

class AssessmentStatus(str, Enum):
    DRAFT = "draft"
    IN_PROGRESS = "in_progress"
    PENDING_REVIEW = "pending_review"
    REVIEWED = "reviewed"
    COMPLETED = "completed"
    RETURNED = "returned"

class WorkflowTransition(BaseModel):
    from_status: AssessmentStatus
    to_status: AssessmentStatus
    requires_validation: bool = False
    requires_authorization: bool = False
    auto_transition: bool = False
    validation_rules: List[str] = []
    allowed_roles: List[str] = []

class ValidationError(BaseModel):
    field: str
    message: str

class WorkflowService:
    def __init__(self, db_session):
        self.db = db_session
        self._transitions: Dict[AssessmentStatus, Set[AssessmentStatus]] = {
            AssessmentStatus.DRAFT: {AssessmentStatus.IN_PROGRESS},
            AssessmentStatus.IN_PROGRESS: {AssessmentStatus.PENDING_REVIEW, AssessmentStatus.DRAFT},
            AssessmentStatus.PENDING_REVIEW: {AssessmentStatus.REVIEWED, AssessmentStatus.RETURNED},
            AssessmentStatus.REVIEWED: {AssessmentStatus.COMPLETED},
            AssessmentStatus.RETURNED: {AssessmentStatus.IN_PROGRESS},
            AssessmentStatus.COMPLETED: set()  # Terminal state
        }

        self._transition_rules = {
            (AssessmentStatus.DRAFT, AssessmentStatus.IN_PROGRESS): WorkflowTransition(
                from_status=AssessmentStatus.DRAFT,
                to_status=AssessmentStatus.IN_PROGRESS,
                requires_validation=True,
                validation_rules=["required_fields", "patient_info"]
            ),
            (AssessmentStatus.IN_PROGRESS, AssessmentStatus.PENDING_REVIEW): WorkflowTransition(
                from_status=AssessmentStatus.IN_PROGRESS,
                to_status=AssessmentStatus.PENDING_REVIEW,
                requires_validation=True,
                validation_rules=["all_required_fields", "scoring_complete"]
            ),
            (AssessmentStatus.PENDING_REVIEW, AssessmentStatus.REVIEWED): WorkflowTransition(
                from_status=AssessmentStatus.PENDING_REVIEW,
                to_status=AssessmentStatus.REVIEWED,
                requires_authorization=True,
                allowed_roles=["reviewer", "supervisor"]
            ),
            (AssessmentStatus.REVIEWED, AssessmentStatus.COMPLETED): WorkflowTransition(
                from_status=AssessmentStatus.REVIEWED,
                to_status=AssessmentStatus.COMPLETED,
                auto_transition=True
            ),
            (AssessmentStatus.PENDING_REVIEW, AssessmentStatus.RETURNED): WorkflowTransition(
                from_status=AssessmentStatus.PENDING_REVIEW,
                to_status=AssessmentStatus.RETURNED,
                requires_authorization=True,
                allowed_roles=["reviewer", "supervisor"]
            )
        }

    async def validate_assessment(self, assessment: Dict, rules: List[str]) -> List[ValidationError]:
        """Validate assessment against specified rules"""
        errors: List[ValidationError] = []
        
        for rule in rules:
            if rule == "required_fields":
                if not assessment.get("patient_info"):
                    errors.append(ValidationError(
                        field="patient_info",
                        message="Patient information is required"
                    ))
                    
            elif rule == "all_required_fields":
                template = await self._get_template(assessment["template_id"])
                for section in template.sections:
                    for field in section.fields:
                        if field.required:
                            response = self._get_field_response(assessment, section.id, field.id)
                            if not response:
                                errors.append(ValidationError(
                                    field=f"{section.id}.{field.id}",
                                    message=f"Required field '{field.label}' is missing"
                                ))
                                
            elif rule == "scoring_complete":
                if not assessment.get("score"):
                    errors.append(ValidationError(
                        field="score",
                        message="Assessment scoring must be completed"
                    ))

        return errors

    async def check_authorization(self, user_id: str, roles: List[str], transition: WorkflowTransition) -> bool:
        """Check if user is authorized for the transition"""
        if not transition.requires_authorization:
            return True
            
        user_roles = await self._get_user_roles(user_id)
        return bool(set(user_roles) & set(transition.allowed_roles))

    async def can_transition(
        self,
        assessment_id: str,
        from_status: AssessmentStatus,
        to_status: AssessmentStatus,
        user_id: str
    ) -> tuple[bool, Optional[str]]:
        """Check if status transition is allowed"""
        if to_status not in self._transitions.get(from_status, set()):
            return False, "Invalid status transition"

        transition = self._transition_rules.get((from_status, to_status))
        if not transition:
            return False, "Transition rules not found"

        if transition.requires_authorization:
            is_authorized = await self.check_authorization(user_id, transition.allowed_roles, transition)
            if not is_authorized:
                return False, "User not authorized for this transition"

        if transition.requires_validation:
            assessment = await self._get_assessment(assessment_id)
            errors = await self.validate_assessment(assessment, transition.validation_rules)
            if errors:
                return False, f"Validation failed: {', '.join(e.message for e in errors)}"

        return True, None

    async def transition_status(
        self,
        assessment_id: str,
        from_status: AssessmentStatus,
        to_status: AssessmentStatus,
        user_id: str,
        transition_data: Optional[Dict] = None
    ) -> tuple[bool, Optional[str]]:
        """Execute status transition if allowed"""
        can_transition, error = await self.can_transition(assessment_id, from_status, to_status, user_id)
        if not can_transition:
            return False, error

        # Perform the transition
        success = await self._update_assessment_status(
            assessment_id,
            to_status,
            user_id,
            transition_data
        )

        if success:
            # Log the transition in changelog
            await self._log_status_change(
                assessment_id,
                user_id,
                from_status,
                to_status,
                transition_data
            )

            # Handle any automatic transitions
            next_transition = self._transition_rules.get((to_status, None))
            if next_transition and next_transition.auto_transition:
                return await self.transition_status(
                    assessment_id,
                    to_status,
                    next_transition.to_status,
                    user_id
                )

        return success, None

    async def _get_assessment(self, assessment_id: str) -> Dict:
        """Fetch assessment from database"""
        # Here we would fetch from database
        # For now, returning mock data
        return {}

    async def _get_template(self, template_id: str) -> Dict:
        """Fetch template from database"""
        # Here we would fetch from database
        # For now, returning mock data
        return {}

    async def _get_user_roles(self, user_id: str) -> List[str]:
        """Fetch user roles from database"""
        # Here we would fetch from database
        # For now, returning mock data
        return []

    async def _update_assessment_status(
        self,
        assessment_id: str,
        status: AssessmentStatus,
        user_id: str,
        transition_data: Optional[Dict]
    ) -> bool:
        """Update assessment status in database"""
        # Here we would update in database
        # For now, returning mock success
        return True

    async def _log_status_change(
        self,
        assessment_id: str,
        user_id: str,
        from_status: AssessmentStatus,
        to_status: AssessmentStatus,
        transition_data: Optional[Dict]
    ) -> None:
        """Log status change in changelog"""
        # Here we would log to changelog
        pass