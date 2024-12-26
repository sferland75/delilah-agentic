from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import uuid4
from pydantic import BaseModel, Field

class ChangelogEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    assessment_id: str
    user_id: str
    action: str  # 'create', 'update', 'submit', 'review', etc.
    changes: Dict[str, Any]  # Store actual changes
    created_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[Dict[str, Any]] = None

class ChangelogService:
    def __init__(self, db_session):
        self.db = db_session

    async def log_change(
        self,
        assessment_id: str,
        user_id: str,
        action: str,
        changes: Dict[str, Any],
        metadata: Optional[Dict[str, Any]] = None,
    ) -> ChangelogEntry:
        entry = ChangelogEntry(
            assessment_id=assessment_id,
            user_id=user_id,
            action=action,
            changes=changes,
            metadata=metadata,
        )
        # Here we would save to database
        # For now, returning mock data
        return entry

    async def get_assessment_history(
        self,
        assessment_id: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> List[ChangelogEntry]:
        # Here we would fetch from database with filters
        # For now, returning mock data
        return []

    async def get_user_activity(
        self,
        user_id: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> List[ChangelogEntry]:
        # Here we would fetch from database with filters
        # For now, returning mock data
        return []

    def compare_changes(self, old_data: Dict[str, Any], new_data: Dict[str, Any]) -> Dict[str, Any]:
        """Compare old and new data to generate a changes dictionary"""
        changes: Dict[str, Any] = {}
        
        for key in set(old_data.keys()) | set(new_data.keys()):
            old_value = old_data.get(key)
            new_value = new_data.get(key)
            
            if old_value != new_value:
                changes[key] = {
                    'old': old_value,
                    'new': new_value,
                }
        
        return changes