from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from services.template_service import TemplateService
from schemas.template import Template, TemplateCreate, TemplateUpdate, TemplateStatus
from dependencies.auth import get_current_user, check_roles
from models.user import User

router = APIRouter()

@router.post("/", response_model=Template)
async def create_template(
    template_data: TemplateCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    template_service = TemplateService(db)
    return await template_service.create_template(template_data, current_user.id)

@router.get("/", response_model=List[Template])
async def list_templates(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    template_service = TemplateService(db)
    return await template_service.list_templates(skip, limit)

@router.get("/{template_id}", response_model=Template)
async def get_template(
    template_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    template_service = TemplateService(db)
    template = await template_service.get_template(template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template

@router.put("/{template_id}", response_model=Template)
async def update_template(
    template_id: str,
    template_data: TemplateUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(check_roles(["admin", "therapist"]))
):
    template_service = TemplateService(db)
    template = await template_service.update_template(template_id, template_data)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template

@router.delete("/{template_id}")
async def delete_template(
    template_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(check_roles(["admin"]))
):
    template_service = TemplateService(db)
    success = await template_service.delete_template(template_id)
    if not success:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"message": "Template deleted successfully"}