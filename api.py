from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from uuid import UUID, uuid4
import asyncio
from coordinator import AgentCoordinator
from agents.assessment_agent import AssessmentType

app = FastAPI()
coordinator = AgentCoordinator()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AssessmentStart(BaseModel):
    assessment_type: str

class StepResponse(BaseModel):
    step_id: str
    response: str

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(coordinator.run())

@app.post("/assessments/start")
async def start_assessment(data: AssessmentStart):
    session_id = await coordinator.start_assessment(
        client_id=uuid4(),  # Mock client ID
        therapist_id=uuid4(),  # Mock therapist ID
        assessment_type=data.assessment_type
    )
    return {"session_id": session_id}

@app.get("/assessments/{session_id}/status")
async def get_status(session_id: UUID):
    try:
        status = await coordinator.get_session_status(session_id)
        return status
    except ValueError:
        raise HTTPException(status_code=404, detail="Session not found")

@app.post("/assessments/{session_id}/respond")
async def submit_response(session_id: UUID, response: StepResponse):
    try:
        result = await coordinator.assessment_agent.submit_response(
            session_id=session_id,
            step_id=response.step_id,
            response=response.response
        )
        return result
    except ValueError:
        raise HTTPException(status_code=404, detail="Invalid session or step")