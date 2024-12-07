from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID, uuid4
import asyncio
from coordinator import AgentCoordinator
from agents.assessment_agent import AssessmentType
from agents.client_manager import ClientManager

app = FastAPI()
coordinator = AgentCoordinator()
client_manager = ClientManager()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ClientCreate(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: datetime
    contact_info: dict

class AssessmentStart(BaseModel):
    client_id: UUID
    assessment_type: str

class StepResponse(BaseModel):
    step_id: str
    response: str

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(coordinator.run())

# Client Management Endpoints
@app.post("/clients")
async def create_client(client: ClientCreate):
    new_client = await client_manager.create_client(
        first_name=client.first_name,
        last_name=client.last_name,
        date_of_birth=client.date_of_birth,
        contact_info=client.contact_info
    )
    return new_client

@app.get("/clients")
async def list_clients():
    return await client_manager.list_clients()

@app.get("/clients/{client_id}")
async def get_client(client_id: UUID):
    if client := await client_manager.get_client(client_id):
        return client
    raise HTTPException(status_code=404, detail="Client not found")

@app.get("/clients/{client_id}/assessments")
async def get_client_assessments(client_id: UUID):
    if not await client_manager.get_client(client_id):
        raise HTTPException(status_code=404, detail="Client not found")
    return await client_manager.get_client_assessments(client_id)

# Assessment Endpoints
@app.post("/assessments/start")
async def start_assessment(data: AssessmentStart):
    if not await client_manager.get_client(data.client_id):
        raise HTTPException(status_code=404, detail="Client not found")
    
    session_id = await coordinator.start_assessment(
        client_id=data.client_id,
        therapist_id=uuid4(),  # Mock therapist ID for now
        assessment_type=data.assessment_type
    )
    
    await client_manager.add_assessment(data.client_id, session_id)
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