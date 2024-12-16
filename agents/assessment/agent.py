from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID, uuid4

from .models import (
    Assessment,
    AssessmentProtocol,
    AssessmentStatus,
    AssessmentStep
)
from api.repositories.agent_repository import EnhancedAgentRepository

class AssessmentAgent:
    def __init__(self, repository: EnhancedAgentRepository):
        self.repository = repository
        self.current_assessment: Optional[Assessment] = None
        self.current_protocol: Optional[AssessmentProtocol] = None
        self.agent_id: Optional[str] = None

    async def initialize_assessment(
        self,
        patient_id: str,
        protocol_id: str,
        assessment_type: str
    ) -> Assessment:
        """Initialize a new assessment for a patient."""
        assessment = Assessment(
            id=str(uuid4()),
            patient_id=patient_id,
            protocol_id=protocol_id,
            type=assessment_type,
            status=AssessmentStatus.PENDING,
            started_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # Store in agent state
        await self.repository.update_state(UUID(self.agent_id), {
            "status": "processing",
            "current_assessment": assessment.dict(),
            "progress": 0,
            "last_updated": datetime.utcnow().isoformat()
        })
        
        self.current_assessment = assessment
        return assessment

    async def load_protocol(self, protocol_id: str) -> AssessmentProtocol:
        """Load assessment protocol."""
        # In a real implementation, this would load from a protocol repository
        protocol = AssessmentProtocol(
            name="Basic OT Assessment",
            version="1.0",
            areas=["cognitive", "physical"],
            steps=[
                AssessmentStep(
                    id="patient_info",
                    title="Patient Information",
                    description="Collect basic patient information",
                    type="form"
                ),
                AssessmentStep(
                    id="cognitive_assessment",
                    title="Cognitive Assessment",
                    description="Evaluate cognitive functions",
                    type="evaluation"
                ),
                AssessmentStep(
                    id="physical_assessment",
                    title="Physical Assessment",
                    description="Evaluate physical capabilities",
                    type="evaluation"
                )
            ]
        )
        self.current_protocol = protocol
        return protocol

    async def start_assessment(self) -> Assessment:
        """Start the assessment process."""
        if not self.current_assessment:
            raise ValueError("No assessment initialized")
        
        if not self.current_protocol:
            await self.load_protocol(self.current_assessment.protocol_id)
        
        self.current_assessment.status = AssessmentStatus.IN_PROGRESS
        self.current_assessment.current_step = self.current_protocol.steps[0].id
        self.current_assessment.updated_at = datetime.utcnow()
        
        await self.repository.update_state(UUID(self.agent_id), {
            "status": "processing",
            "current_assessment": self.current_assessment.dict(),
            "progress": 0,
            "last_updated": datetime.utcnow().isoformat()
        })
        
        return self.current_assessment

    async def record_step_data(
        self,
        step_id: str,
        data: Dict[str, Any]
    ) -> Assessment:
        """Record data for a specific assessment step."""
        if not self.current_assessment:
            raise ValueError("No active assessment")
            
        if not self.current_protocol:
            await self.load_protocol(self.current_assessment.protocol_id)
            
        if step_id not in [step.id for step in self.current_protocol.steps]:
            raise ValueError(f"Invalid step ID: {step_id}")
            
        self.current_assessment.data[step_id] = data
        self.current_assessment.completed_steps.append(step_id)
        self.current_assessment.updated_at = datetime.utcnow()
        
        # Calculate progress
        progress = len(self.current_assessment.completed_steps) / len(self.current_protocol.steps) * 100
        
        # Update next step
        current_step_index = next(
            (i for i, step in enumerate(self.current_protocol.steps) if step.id == step_id),
            None
        )
        if current_step_index is not None and current_step_index < len(self.current_protocol.steps) - 1:
            self.current_assessment.current_step = self.current_protocol.steps[current_step_index + 1].id
        
        await self.repository.update_state(UUID(self.agent_id), {
            "status": "processing",
            "current_assessment": self.current_assessment.dict(),
            "progress": progress,
            "last_updated": datetime.utcnow().isoformat()
        })
        
        return self.current_assessment

    async def complete_assessment(self) -> Assessment:
        """Complete the current assessment."""
        if not self.current_assessment:
            raise ValueError("No active assessment")
            
        if not self.current_protocol:
            await self.load_protocol(self.current_assessment.protocol_id)
            
        # Verify all required steps are completed
        required_steps = [step.id for step in self.current_protocol.steps if step.required]
        completed_steps = set(self.current_assessment.completed_steps)
        missing_steps = [step for step in required_steps if step not in completed_steps]
        
        if missing_steps:
            raise ValueError(f"Cannot complete assessment. Missing required steps: {missing_steps}")
            
        self.current_assessment.status = AssessmentStatus.COMPLETED
        self.current_assessment.completed_at = datetime.utcnow()
        self.current_assessment.updated_at = datetime.utcnow()
        
        await self.repository.update_state(UUID(self.agent_id), {
            "status": "completed",
            "current_assessment": self.current_assessment.dict(),
            "progress": 100,
            "last_updated": datetime.utcnow().isoformat()
        })
        
        return self.current_assessment

    async def pause_assessment(self) -> Assessment:
        """Pause the current assessment."""
        if not self.current_assessment:
            raise ValueError("No active assessment")
            
        if not self.current_protocol:
            await self.load_protocol(self.current_assessment.protocol_id)
            
        self.current_assessment.status = AssessmentStatus.PAUSED
        self.current_assessment.updated_at = datetime.utcnow()
        
        progress = len(self.current_assessment.completed_steps) / len(self.current_protocol.steps) * 100
        
        await self.repository.update_state(UUID(self.agent_id), {
            "status": "paused",
            "current_assessment": self.current_assessment.dict(),
            "progress": progress,
            "last_updated": datetime.utcnow().isoformat()
        })
        
        return self.current_assessment
