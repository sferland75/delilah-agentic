from typing import List
from agents.assessment.models import AssessmentStep, AssessmentArea

def get_basic_protocol() -> List[AssessmentStep]:
    """Define the basic assessment protocol steps."""
    return [
        AssessmentStep(
            id="patient_info",
            title="Patient Information",
            description="Collect basic patient demographic and medical information",
            type="form",
            required=True
        ),
        AssessmentStep(
            id="cognitive_screening",
            title="Cognitive Screening",
            description="Basic cognitive function assessment",
            type="evaluation",
            required=True
        ),
        AssessmentStep(
            id="physical_mobility",
            title="Physical Mobility Assessment",
            description="Evaluate range of motion and mobility",
            type="evaluation",
            required=True
        ),
        AssessmentStep(
            id="adl_assessment",
            title="Activities of Daily Living",
            description="Assess independence in daily activities",
            type="checklist",
            required=True
        ),
        AssessmentStep(
            id="environmental_assessment",
            title="Environmental Assessment",
            description="Evaluate home/work environment",
            type="form",
            required=False
        ),
        AssessmentStep(
            id="goals_planning",
            title="Goals and Treatment Planning",
            description="Set treatment goals and develop initial plan",
            type="planning",
            required=True
        )
    ]
