from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response, JSONResponse
import time

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, rate_limit=100, time_window=60, exclude_paths=None):
        super().__init__(app)
        self.rate_limit = rate_limit
        self.time_window = time_window
        self.exclude_paths = exclude_paths or []
        self.request_counts = {}

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Skip rate limiting for excluded paths
        if request.url.path in self.exclude_paths:
            return await call_next(request)

        # Simple rate limiting logic
        client_ip = request.client.host
        current_time = time.time()

        # Remove old request timestamps
        if client_ip in self.request_counts:
            self.request_counts[client_ip] = [
                ts for ts in self.request_counts.get(client_ip, []) 
                if current_time - ts < self.time_window
            ]

        # Check rate limit
        if len(self.request_counts.get(client_ip, [])) >= self.rate_limit:
            return JSONResponse(
                status_code=429, 
                content={"detail": "Too many requests"}
            )

        # Add current request timestamp
        if client_ip not in self.request_counts:
            self.request_counts[client_ip] = []
        self.request_counts[client_ip].append(current_time)

        return await call_next(request)
