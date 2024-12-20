import enum

class AssessmentStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class DocumentationType(str, enum.Enum):
    ASSESSMENT_NOTE = "assessment_note"
    PROGRESS_NOTE = "progress_note"
    TREATMENT_PLAN = "treatment_plan"
    DISCHARGE_SUMMARY = "discharge_summary"