from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import List, Optional
from models.template import Template
from schemas.template import TemplateCreate, TemplateUpdate
from fastapi import HTTPException

class TemplateService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_template(self, template_data: TemplateCreate, user_id: str) -> Template:
        template = Template(
            **template_data.model_dump(),
            created_by=user_id
        )
        self.db.add(template)
        await self.db.commit()
        await self.db.refresh(template)
        return template

    async def get_template(self, template_id: str) -> Optional[Template]:
        result = await self.db.execute(
            select(Template).where(Template.id == template_id)
        )
        return result.scalar_one_or_none()

    async def list_templates(self, skip: int = 0, limit: int = 100) -> List[Template]:
        result = await self.db.execute(
            select(Template)
            .offset(skip)
            .limit(limit)
            .order_by(Template.created_at.desc())
        )
        return result.scalars().all()

    async def update_template(self, template_id: str, template_data: TemplateUpdate) -> Optional[Template]:
        template = await self.get_template(template_id)
        if not template:
            return None

        for field, value in template_data.model_dump(exclude_unset=True).items():
            setattr(template, field, value)

        await self.db.commit()
        await self.db.refresh(template)
        return template

    async def delete_template(self, template_id: str) -> bool:
        template = await self.get_template(template_id)
        if not template:
            return False

        await self.db.delete(template)
        await self.db.commit()
        return True

    async def get_templates_by_category(self, category_id: str, skip: int = 0, limit: int = 100) -> List[Template]:
        result = await self.db.execute(
            select(Template)
            .where(Template.category_id == category_id)
            .offset(skip)
            .limit(limit)
            .order_by(Template.created_at.desc())
        )
        return result.scalars().all()

    async def update_template_status(self, template_id: str, status: str) -> Optional[Template]:
        template = await self.get_template(template_id)
        if not template:
            return None

        template.status = status
        await self.db.commit()
        await self.db.refresh(template)
        return template
