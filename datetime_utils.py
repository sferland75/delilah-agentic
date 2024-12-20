# datetime_utils.py
from datetime import datetime, timezone
from typing import Optional

def strip_timezone(dt: Optional[datetime]) -> Optional[datetime]:
    """Convert a timezone-aware datetime to naive UTC datetime."""
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt
    return dt.astimezone(timezone.utc).replace(tzinfo=None)