from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select, update
from typing import Optional, List, Dict, Any
from datetime import datetime
from .models import Base, Agent, AgentTask, AgentStateTransition, TaskStateTransition, AgentStatus, TaskStatus

class DatabaseService:
    def __init__(self, database_url: str):
        self.engine = create_async_engine(database_url, echo=True)
        self.async_session = sessionmaker(
            self.engine, class_=AsyncSession, expire_on_commit=False
        )

    async def initialize(self):
        """Initialize database tables"""
        async with self.engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async def create_agent(self, agent_id: str, agent_type: str, config: Dict[str, Any]) -> Agent:
        """Create a new agent"""
        async with self.async_session() as session:
            agent = Agent(
                agent_id=agent_id,
                agent_type=agent_type,
                status=AgentStatus.INACTIVE,
                config=config
            )
            session.add(agent)
            await session.commit()
            await session.refresh(agent)
            return agent

    async def get_agent(self, agent_id: str) -> Optional[Agent]:
        """Get agent by ID"""
        async with self.async_session() as session:
            result = await session.execute(
                select(Agent).where(Agent.agent_id == agent_id)
            )
            return result.scalar_one_or_none()

    async def update_agent_status(self, agent_id: str, status: AgentStatus) -> Optional[Agent]:
        """Update agent status"""
        async with self.async_session() as session:
            result = await session.execute(
                update(Agent)
                .where(Agent.agent_id == agent_id)
                .values(status=status, updated_at=datetime.utcnow())
                .returning(Agent)
            )
            await session.commit()
            return result.scalar_one_or_none()

    async def create_task(self, agent_id: str, task_type: str, input_data: Dict[str, Any], priority: int = 0) -> AgentTask:
        """Create a new task for an agent"""
        async with self.async_session() as session:
            # Get agent record
            result = await session.execute(
                select(Agent).where(Agent.agent_id == agent_id)
            )
            agent = result.scalar_one()

            task = AgentTask(
                agent_id=agent.id,
                task_type=task_type,
                status=TaskStatus.PENDING,
                priority=priority,
                input_data=input_data
            )
            session.add(task)
            await session.commit()
            await session.refresh(task)
            return task

    async def get_task(self, task_id: int) -> Optional[AgentTask]:
        """Get task by ID"""
        async with self.async_session() as session:
            result = await session.execute(
                select(AgentTask).where(AgentTask.id == task_id)
            )
            return result.scalar_one_or_none()

    async def update_task_status(
        self, 
        task_id: int, 
        status: TaskStatus, 
        output_data: Optional[Dict[str, Any]] = None,
        error_message: Optional[str] = None
    ) -> Optional[AgentTask]:
        """Update task status and results"""
        async with self.async_session() as session:
            updates = {
                "status": status,
                "output_data": output_data,
                "error_message": error_message
            }
            
            if status == TaskStatus.IN_PROGRESS:
                updates["started_at"] = datetime.utcnow()
            elif status in [TaskStatus.COMPLETED, TaskStatus.FAILED]:
                updates["completed_at"] = datetime.utcnow()

            result = await session.execute(
                update(AgentTask)
                .where(AgentTask.id == task_id)
                .values(**updates)
                .returning(AgentTask)
            )
            await session.commit()
            return result.scalar_one_or_none()

    async def record_agent_state_transition(
        self,
        agent_id: str,
        from_state: str,
        to_state: str,
        context: Optional[Dict[str, Any]] = None
    ) -> AgentStateTransition:
        """Record agent state transition"""
        async with self.async_session() as session:
            # Get agent record
            result = await session.execute(
                select(Agent).where(Agent.agent_id == agent_id)
            )
            agent = result.scalar_one()

            transition = AgentStateTransition(
                agent_id=agent.id,
                from_state=from_state,
                to_state=to_state,
                context=context
            )
            session.add(transition)
            await session.commit()
            await session.refresh(transition)
            return transition

    async def record_task_state_transition(
        self,
        task_id: int,
        from_state: str,
        to_state: str,
        context: Optional[Dict[str, Any]] = None
    ) -> TaskStateTransition:
        """Record task state transition"""
        async with self.async_session() as session:
            transition = TaskStateTransition(
                task_id=task_id,
                from_state=from_state,
                to_state=to_state,
                context=context
            )
            session.add(transition)
            await session.commit()
            await session.refresh(transition)
            return transition

    async def get_agent_state_history(self, agent_id: str) -> List[AgentStateTransition]:
        """Get agent state transition history"""
        async with self.async_session() as session:
            result = await session.execute(
                select(AgentStateTransition)
                .join(Agent)
                .where(Agent.agent_id == agent_id)
                .order_by(AgentStateTransition.created_at)
            )
            return result.scalars().all()

    async def get_task_state_history(self, task_id: int) -> List[TaskStateTransition]:
        """Get task state transition history"""
        async with self.async_session() as session:
            result = await session.execute(
                select(TaskStateTransition)
                .where(TaskStateTransition.task_id == task_id)
                .order_by(TaskStateTransition.created_at)
            )
            return result.scalars().all()