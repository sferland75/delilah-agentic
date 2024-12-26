from fastapi import HTTPException
from typing import Any, Dict, Optional

class DelilahError(HTTPException):
    def __init__(
        self,
        status_code: int,
        detail: Any = None,
        headers: Optional[Dict[str, str]] = None,
        error_code: str = None
    ) -> None:
        super().__init__(status_code=status_code, detail=detail, headers=headers)
        self.error_code = error_code

class ErrorHandler:
    @staticmethod
    def handle_error(error: Exception) -> DelilahError:
        if isinstance(error, DelilahError):
            return error
            
        # Add specific error handling as needed
        return DelilahError(
            status_code=500,
            detail=str(error),
            error_code="INTERNAL_ERROR"
        )