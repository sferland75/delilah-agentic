from pydantic import BaseModel, UUID4
from typing import List, Dict, Optional, Any
from enum import Enum

class AssessmentLevel(str, Enum):
    LEVEL_1 = "routine_personal_care"
    LEVEL_2 = "basic_supervisory"
    LEVEL_3 = "complex_health_care"

class FunctionalMetric(BaseModel):
    name: str
    score_range: tuple[int, int] = (0, 10)
    observation_required: bool = True
    pre_post_comparison: bool = True

class AssessmentSection(BaseModel):
    title: str
    description: str
    metrics: List[FunctionalMetric]
    required_observations: bool = True

class InHomeAssessmentTemplate(BaseModel):
    id: UUID4
    title: str
    sections: Dict[str, AssessmentSection] = {
        "personal_care": AssessmentSection(
            title="Routine Personal Care",
            description="Assessment of basic self-care activities",
            metrics=[
                FunctionalMetric(name="dressing_upper", observation_required=True),
                FunctionalMetric(name="dressing_lower", observation_required=True),
                FunctionalMetric(name="grooming", observation_required=True),
                FunctionalMetric(name="bathing", observation_required=True),
                FunctionalMetric(name="feeding", observation_required=True),
                FunctionalMetric(name="mobility", observation_required=True)
            ]
        ),
        "home_management": AssessmentSection(
            title="Home Management",
            description="Assessment of household activities",
            metrics=[
                FunctionalMetric(name="meal_preparation", observation_required=True),
                FunctionalMetric(name="housekeeping", observation_required=True),
                FunctionalMetric(name="laundry", observation_required=True),
                FunctionalMetric(name="outdoor_maintenance", observation_required=False)
            ]
        ),
        "physical_function": AssessmentSection(
            title="Physical Function Assessment",
            description="Evaluation of physical capabilities",
            metrics=[
                FunctionalMetric(name="range_of_motion", observation_required=True),
                FunctionalMetric(name="strength", observation_required=True),
                FunctionalMetric(name="balance", observation_required=True),
                FunctionalMetric(name="endurance", observation_required=True)
            ]
        ),
        "cognitive_function": AssessmentSection(
            title="Cognitive Assessment",
            description="Evaluation of cognitive capabilities",
            metrics=[
                FunctionalMetric(name="memory", observation_required=True),
                FunctionalMetric(name="attention", observation_required=True),
                FunctionalMetric(name="problem_solving", observation_required=True),
                FunctionalMetric(name="safety_awareness", observation_required=True)
            ]
        ),
        "environmental": AssessmentSection(
            title="Environmental Assessment",
            description="Evaluation of living environment",
            metrics=[
                FunctionalMetric(name="accessibility", observation_required=True),
                FunctionalMetric(name="safety_hazards", observation_required=True),
                FunctionalMetric(name="adaptive_equipment_needs", observation_required=True)
            ]
        ),
        "attendant_care": AssessmentSection(
            title="Attendant Care Needs",
            description="Assessment of care requirements",
            metrics=[
                FunctionalMetric(name="level_1_care", observation_required=True),
                FunctionalMetric(name="level_2_care", observation_required=True),
                FunctionalMetric(name="level_3_care", observation_required=True)
            ]
        )
    }
    version: str
    scoring_guide: Dict[str, Any] = {
        "scale": {
            "0": "Unable to perform",
            "1-3": "Severe difficulty",
            "4-6": "Moderate difficulty",
            "7-9": "Mild difficulty",
            "10": "Independent"
        },
        "functional_levels": {
            "independent": "No assistance required",
            "modified_independent": "Independent with devices",
            "supervision": "Requires supervision/cueing",
            "minimal_assistance": "Requires <25% assistance",
            "moderate_assistance": "Requires 25-50% assistance",
            "maximal_assistance": "Requires 50-75% assistance",
            "dependent": "Requires >75% assistance"
        }
    }