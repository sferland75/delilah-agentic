from fastapi import Depends
from coordinator import AgentCoordinator
from functools import lru_cache

@lru_cache()
def get_coordinator() -> AgentCoordinator:
    """Singleton pattern for AgentCoordinator"""
    return AgentCoordinator()