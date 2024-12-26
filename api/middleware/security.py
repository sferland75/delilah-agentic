from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response, JSONResponse
from typing import List

class SecurityMiddleware(BaseHTTPMiddleware):
    def __init__(
        self, 
        app, 
        allowed_hosts: List[str] = None, 
        enable_csrf: bool = False,
        enable_xss_protection: bool = True,
        enable_hsts: bool = False,
        frame_deny: bool = True
    ):
        super().__init__(app)
        self.allowed_hosts = allowed_hosts or ['localhost', '127.0.0.1']
        self.enable_csrf = enable_csrf
        self.enable_xss_protection = enable_xss_protection
        self.enable_hsts = enable_hsts
        self.frame_deny = frame_deny

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Host validation
        if self.allowed_hosts and request.client.host not in self.allowed_hosts:
            return JSONResponse(
                status_code=403, 
                content={"detail": "Access denied"}
            )

        # Basic XSS protection
        if self.enable_xss_protection:
            # Simple XSS prevention for headers
            if 'script' in request.headers.get('user-agent', '').lower():
                return JSONResponse(
                    status_code=400, 
                    content={"detail": "Potential XSS attack detected"}
                )

        # Prepare response
        response = await call_next(request)

        # Security headers
        if self.enable_hsts:
            response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'

        if self.frame_deny:
            response.headers['X-Frame-Options'] = 'DENY'

        # Additional security headers
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'

        return response
