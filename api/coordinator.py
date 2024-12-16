from typing import Dict, Any, Optional
from uuid import UUID

from agents.assessment.agent import AssessmentAgent
from api.repositories.agent_repository import EnhancedAgentRepository

class AgentCoordinator:
    def __init__(self, repository: EnhancedAgentRepository):
        self.repository = repository
        self.active_agents: Dict[str, Any] = {}

    async def get_or_create_agent(self, agent_id: UUID, agent_type: str) -> Any:
        """Get an existing agent or create a new one."""
        agent_key = str(agent_id)
        
        if agent_key in self.active_agents:
            return self.active_agents[agent_key]
        
        if agent_type == "assessor":
            agent = AssessmentAgent(self.repository)
            agent.agent_id = agent_key
            self.active_agents[agent_key] = agent
            return agent
            
        raise ValueError(f"Unknown agent type: {agent_type}")

    async def get_agent(self, agent_id: UUID) -> Optional[Any]:
        """Get an existing agent."""
        return self.active_agents.get(str(agent_id))

    async def remove_agent(self, agent_id: UUID) -> None:
        """Remove an agent from active agents."""
        self.active_agents.pop(str(agent_id), None)
