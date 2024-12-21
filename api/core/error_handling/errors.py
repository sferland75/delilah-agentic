from .base import DelilahError

class NotFoundError(DelilahError):
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status_code=404, detail=detail)

class ValidationError(DelilahError):
    def __init__(self, detail: str = "Validation error"):
        super().__init__(status_code=422, detail=detail)

class AuthenticationError(DelilahError):
    def __init__(self, detail: str = "Authentication failed"):
        super().__init__(status_code=401, detail=detail)

class AuthorizationError(DelilahError):
    def __init__(self, detail: str = "Not authorized"):
        super().__init__(status_code=403, detail=detail)

class DatabaseError(DelilahError):
    def __init__(self, detail: str = "Database error"):
        super().__init__(status_code=500, detail=detail)

class InternalServerError(DelilahError):
    def __init__(self, detail: str = "Internal server error"):
        super().__init__(status_code=500, detail=detail)