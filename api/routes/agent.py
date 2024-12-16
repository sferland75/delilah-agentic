from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from ..models.agent import AgentCreate, AgentUpdate, AgentResponse
from database.models import Agent
from api.dependencies import get_db

router = APIRouter(prefix="/agents", tags=["agents"])

@router.post("/", response_model=AgentResponse)
def create_agent(agent: AgentCreate, db: Session = Depends(get_db)):
    db_agent = Agent(
        name=agent.name,
        type=agent.type,
        state=agent.state,
        active=agent.active
    )
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)
    return db_agent

@router.get("/", response_model=List[AgentResponse])
def list_agents(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    agents = db.query(Agent).offset(skip).limit(limit).all()
    return agents

@router.get("/{agent_id}", response_model=AgentResponse)
def get_agent(agent_id: uuid.UUID, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with id {agent_id} not found"
        )
    return agent

@router.put("/{agent_id}", response_model=AgentResponse)
def update_agent(
    agent_id: uuid.UUID,
    agent: AgentUpdate,
    db: Session = Depends(get_db)
):
    db_agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not db_agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with id {agent_id} not found"
        )
    
    update_data = agent.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_agent, key, value)
    
    db.commit()
    db.refresh(db_agent)
    return db_agent

@router.delete("/{agent_id}", response_model=AgentResponse)
def delete_agent(agent_id: uuid.UUID, db: Session = Depends(get_db)):
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with id {agent_id} not found"
        )
    
    db.delete(agent)
    db.commit()
    return agent