from typing import Generator
from sqlalchemy.orm import Session
from database.session import SessionLocal
from coordinator import AgentCoordinator

def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_coordinator() -> AgentCoordinator:
    """Get AgentCoordinator instance"""
    coordinator = AgentCoordinator()
    return coordinator