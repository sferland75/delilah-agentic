from fastapi import APIRouter, HTTPException
from uuid import UUID
from typing import List

from api.repositories.agent_repository import AgentUnitOfWork
from api.schemas.agent import AgentCreate, AgentUpdate, AgentResponse

router = APIRouter(prefix="/agents", tags=["agents"])

@router.post("/", response_model=AgentResponse)
async def create_agent(agent_data: AgentCreate):
    async with AgentUnitOfWork() as uow:
        agent = await uow.agents.create(agent_data.dict())
        return agent

@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent(agent_id: UUID):
    async with AgentUnitOfWork() as uow:
        agent = await uow.agents.get_by_id(agent_id)
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        return agent

@router.get("/", response_model=List[AgentResponse])
async def list_agents(skip: int = 0, limit: int = 100):
    async with AgentUnitOfWork() as uow:
        agents = await uow.agents.get_all(skip=skip, limit=limit)
        return agents

@router.put("/{agent_id}", response_model=AgentResponse)
async def update_agent(agent_id: UUID, agent_data: AgentUpdate):
    async with AgentUnitOfWork() as uow:
        agent = await uow.agents.update(agent_id, agent_data.dict(exclude_unset=True))
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        return agent

@router.put("/{agent_id}/state", response_model=AgentResponse)
async def update_agent_state(agent_id: UUID, state: dict):
    async with AgentUnitOfWork() as uow:
        agent = await uow.agents.update_state(agent_id, state)
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        return agent

@router.delete("/{agent_id}")
async def delete_agent(agent_id: UUID):
    async with AgentUnitOfWork() as uow:
        deleted = await uow.agents.delete(agent_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Agent not found")
        return {"status": "success", "message": "Agent deleted"}
