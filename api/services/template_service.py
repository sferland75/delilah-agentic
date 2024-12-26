from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
import json

from ..models.assessment_template import AssessmentTemplate
from ..schemas.assessment_templates import InHomeAssessmentTemplate

class TemplateService:
    def __init__(self, db: Session):
        self.db = db

    def create_template(self, template_data: dict) -> AssessmentTemplate:
        template = AssessmentTemplate(
            name=template_data["title"],
            type="in_home",
            version=template_data["version"],
            schema=template_data["sections"],
            scoring_guide=template_data["scoring_guide"]
        )
        self.db.add(template)
        self.db.commit()
        self.db.refresh(template)
        return template

    def get_template(self, template_id: UUID) -> Optional[AssessmentTemplate]:
        return self.db.query(AssessmentTemplate).filter(
            AssessmentTemplate.id == template_id,
            AssessmentTemplate.is_active == True
        ).first()

    def get_templates(self, template_type: str = None) -> List[AssessmentTemplate]:
        query = self.db.query(AssessmentTemplate).filter(AssessmentTemplate.is_active == True)
        if template_type:
            query = query.filter(AssessmentTemplate.type == template_type)
        return query.all()

    def update_template(self, template_id: UUID, template_data: dict) -> AssessmentTemplate:
        template = self.get_template(template_id)
        if not template:
            raise ValueError("Template not found")
            
        # Create new version instead of updating existing
        new_template = AssessmentTemplate(
            name=template_data.get("title", template.name),
            type=template_data.get("type", template.type),
            version=str(float(template.version) + 1),
            schema=template_data.get("sections", template.schema),
            scoring_guide=template_data.get("scoring_guide", template.scoring_guide)
        )
        
        template.is_active = False  # Deactivate old version
        self.db.add(new_template)
        self.db.commit()
        self.db.refresh(new_template)
        return new_template

    def get_latest_template(self, template_type: str) -> Optional[AssessmentTemplate]:
        return self.db.query(AssessmentTemplate).filter(
            AssessmentTemplate.type == template_type,
            AssessmentTemplate.is_active == True
        ).order_by(AssessmentTemplate.version.desc()).first()

    def validate_assessment_data(self, template_id: UUID, assessment_data: dict) -> bool:
        template = self.get_template(template_id)
        if not template:
            raise ValueError("Template not found")

        required_sections = set(template.schema.keys())
        provided_sections = set(assessment_data.keys())
        
        if not required_sections.issubset(provided_sections):
            return False
            
        for section, metrics in template.schema.items():
            if section not in assessment_data:
                continue
                
            for metric in metrics["metrics"]:
                if metric["observation_required"] and metric["name"] not in assessment_data[section]:
                    return False
                    
                if metric["name"] in assessment_data[section]:
                    score = assessment_data[section][metric["name"]].get("score")
                    if score is not None and not (metric["score_range"][0] <= score <= metric["score_range"][1]):
                        return False
                        
        return True