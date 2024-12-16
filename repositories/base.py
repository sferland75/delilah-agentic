from typing import TypeVar, Type, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from models.base import Base

ModelType = TypeVar("ModelType", bound=Base)

class BaseRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get(self, model: Type[ModelType], id: str) -> Optional[ModelType]:
        result = await self.session.execute(
            select(model).where(model.id == id)
        )
        return result.scalar_one_or_none()

    async def get_all(self, model: Type[ModelType]) -> List[ModelType]:
        result = await self.session.execute(select(model))
        return result.scalars().all()

    async def create(self, model: ModelType) -> ModelType:
        self.session.add(model)
        await self.session.commit()
        await self.session.refresh(model)
        return model

    async def update(self, model: ModelType) -> ModelType:
        await self.session.commit()
        await self.session.refresh(model)
        return model

    async def delete(self, model: ModelType) -> None:
        await self.session.delete(model)
        await self.session.commit()
