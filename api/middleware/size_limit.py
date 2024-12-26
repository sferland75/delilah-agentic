from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response, JSONResponse

class SizeLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_content_size=10_000_000, max_file_size=5_000_000, excluded_paths=None):
        super().__init__(app)
        self.max_content_size = max_content_size
        self.max_file_size = max_file_size
        self.excluded_paths = excluded_paths or []

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Skip size limit for excluded paths
        if request.url.path in self.excluded_paths:
            return await call_next(request)

        # Check content length
        content_length = int(request.headers.get('content-length', 0))
        if content_length > self.max_content_size:
            return JSONResponse(
                status_code=413, 
                content={"detail": "Request payload too large"}
            )

        # File upload size limit (for multipart/form-data)
        if request.method in ['POST', 'PUT']:
            try:
                form = await request.form()
                for file in form.values():
                    if hasattr(file, 'file'):
                        file.file.seek(0, 2)  # Seek to end of file
                        file_size = file.file.tell()
                        file.file.seek(0)  # Reset file pointer
                        
                        if file_size > self.max_file_size:
                            return JSONResponse(
                                status_code=413, 
                                content={"detail": f"File size exceeds limit of {self.max_file_size} bytes"}
                            )
            except Exception:
                pass  # Not a file upload request

        return await call_next(request)
