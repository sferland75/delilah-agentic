from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime

class TimestampedModel(BaseModel):
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)