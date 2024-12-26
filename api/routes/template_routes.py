from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from ..auth import get_current_user, check_permission, Role
from ..database import get_db
from ..services.template_service import TemplateService
from ..schemas.assessment_templates import InHomeAssessmentTemplate

router = APIRouter(prefix="/assessment/templates", tags=["templates"])

@router.post("/", response_model=InHomeAssessmentTemplate)
async def create_template(
    template: InHomeAssessmentTemplate,
    current_user = Depends(check_permission([Role.ADMIN])),
    db: Session = Depends(get_db)
):
    service = TemplateService(db)
    return service.create_template(template.dict())

@router.get("/{template_id}", response_model=InHomeAssessmentTemplate)
async def get_template(
    template_id: UUID,
    db: Session = Depends(get_db)
):
    service = TemplateService(db)
    template = service.get_template(template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template

@router.get("/", response_model=List[InHomeAssessmentTemplate])
async def list_templates(
    type: str = None,
    db: Session = Depends(get_db)
):
    service = TemplateService(db)
    return service.get_templates(type)

@router.post("/{template_id}/version", response_model=InHomeAssessmentTemplate)
async def create_new_version(
    template_id: UUID,
    template: InHomeAssessmentTemplate,
    current_user = Depends(check_permission([Role.ADMIN])),
    db: Session = Depends(get_db)
):
    service = TemplateService(db)
    return service.update_template(template_id, template.dict())