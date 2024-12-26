from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime

from ..models.changelog import AssessmentChangelog, ChangeType

class ChangelogService:
    def __init__(self, db: Session):
        self.db = db

    def log_change(
        self,
        assessment_id: UUID,
        user_id: UUID,
        change_type: ChangeType,
        previous_state: Optional[Dict[str, Any]] = None,
        new_state: Dict[str, Any] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> AssessmentChangelog:
        changelog = AssessmentChangelog(
            assessment_id=assessment_id,
            user_id=user_id,
            change_type=change_type,
            previous_state=previous_state,
            new_state=new_state,
            metadata=metadata
        )
        self.db.add(changelog)
        self.db.commit()
        self.db.refresh(changelog)
        return changelog

    def get_assessment_history(
        self,
        assessment_id: UUID,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None
    ) -> List[AssessmentChangelog]:
        query = self.db.query(AssessmentChangelog).filter(
            AssessmentChangelog.assessment_id == assessment_id
        )
        
        if from_date:
            query = query.filter(AssessmentChangelog.timestamp >= from_date)
        if to_date:
            query = query.filter(AssessmentChangelog.timestamp <= to_date)
            
        return query.order_by(AssessmentChangelog.timestamp.desc()).all()

    def get_changes_by_user(
        self,
        user_id: UUID,
        limit: int = 50
    ) -> List[AssessmentChangelog]:
        return self.db.query(AssessmentChangelog).filter(
            AssessmentChangelog.user_id == user_id
        ).order_by(AssessmentChangelog.timestamp.desc()).limit(limit).all()