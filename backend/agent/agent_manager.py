from typing import Dict, Any, Optional, Type
import asyncio
import logging
from .base_agent import BaseAgent
from .assessment_agent import AssessmentAgent
from .state_machine import AgentState

logger = logging.getLogger(__name__)

class AgentManager:
    def __init__(self):
        self.agents: Dict[str, BaseAgent] = {}
        self.agent_configs: Dict[str, Dict[str, Any]] = {}
        self._agent_tasks: Dict[str, asyncio.Task] = {}
        
    async def create_agent(self, agent_type: str, agent_id: str, config: Dict[str, Any]) -> BaseAgent:
        """Create a new agent of specified type"""
        if agent_id in self.agents:
            raise ValueError(f"Agent with ID {agent_id} already exists")
            
        agent_cls = self._get_agent_class(agent_type)
        agent = agent_cls(agent_id, config)
        
        try:
            await agent.initialize()
            self.agents[agent_id] = agent
            self.agent_configs[agent_id] = config
            logger.info(f"Created agent {agent_id} of type {agent_type}")
            return agent
        except Exception as e:
            logger.error(f"Failed to create agent {agent_id}: {str(e)}")
            raise
            
    def _get_agent_class(self, agent_type: str) -> Type[BaseAgent]:
        """Get agent class based on type"""
        agent_classes = {
            "assessment": AssessmentAgent,
            # Add other agent types here
        }
        
        if agent_type not in agent_classes:
            raise ValueError(f"Unknown agent type: {agent_type}")
            
        return agent_classes[agent_type]
        
    async def get_agent(self, agent_id: str) -> Optional[BaseAgent]:
        """Get agent by ID"""
        return self.agents.get(agent_id)
        
    async def assign_task(self, agent_id: str, task: Dict[str, Any]):
        """Assign a task to an agent"""
        agent = await self.get_agent(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
            
        if agent.state_machine.state != AgentState.IDLE:
            raise ValueError(f"Agent {agent_id} is not idle (current state: {agent.state_machine.state})")
            
        # Create task for agent
        task_coro = agent.process_task(task)
        task_obj = asyncio.create_task(task_coro)
        self._agent_tasks[agent_id] = task_obj
        
        try:
            await task_obj
        except Exception as e:
            logger.error(f"Task execution failed for agent {agent_id}: {str(e)}")
            raise
        finally:
            self._agent_tasks.pop(agent_id, None)
            
    async def terminate_agent(self, agent_id: str):
        """Terminate an agent"""
        agent = await self.get_agent(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
            
        # Cancel any running task
        if agent_id in self._agent_tasks:
            self._agent_tasks[agent_id].cancel()
            
        try:
            await agent.terminate()
        finally:
            self.agents.pop(agent_id, None)
            self.agent_configs.pop(agent_id, None)
            self._agent_tasks.pop(agent_id, None)
            
    async def get_agent_status(self, agent_id: str) -> Dict[str, Any]:
        """Get agent status"""
        agent = await self.get_agent(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
            
        return agent.get_state()
        
    def get_all_agents(self) -> Dict[str, BaseAgent]:
        """Get all active agents"""
        return self.agents.copy()
        
    async def shutdown(self):
        """Shutdown all agents"""
        shutdown_tasks = []
        
        for agent_id in list(self.agents.keys()):
            shutdown_tasks.append(self.terminate_agent(agent_id))
            
        if shutdown_tasks:
            await asyncio.gather(*shutdown_tasks, return_exceptions=True)