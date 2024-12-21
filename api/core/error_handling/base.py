from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger(__name__)

class DelilahError(HTTPException):
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)

class ErrorHandler:
    @staticmethod
    async def handle_exception(request: Request, exc: Exception) -> JSONResponse:
        if isinstance(exc, DelilahError):
            logger.error(f"DelilahError: {exc.detail}")
            return JSONResponse(
                status_code=exc.status_code,
                content={"error": exc.detail}
            )
        
        # Handle unexpected errors
        logger.error(f"Unexpected error: {str(exc)}", exc_info=exc)
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error"}
        )