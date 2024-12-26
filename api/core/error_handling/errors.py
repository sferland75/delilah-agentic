from .base import DelilahError

class InternalServerError(DelilahError):
    def __init__(self, detail: str = "Internal server error"):
        super().__init__(
            status_code=500,
            detail=detail,
            error_code="INTERNAL_SERVER_ERROR"
        )