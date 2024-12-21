from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.core.config import settings
from api.core.error_handling.base import DelilahError, ErrorHandler
from api.core.error_handling.errors import InternalServerError
from api.routes import (
    agent, assessment, auth, template, assessment_flow,
    error_management
)
from api.middleware.request_id import RequestIDMiddleware
from api.middleware.validation_middleware import ValidationMiddleware
from api.middleware.cache_middleware import ValidationCacheMiddleware
from api.middleware.rate_limit import RateLimitMiddleware
from api.middleware.size_limit import SizeLimitMiddleware
from api.middleware.security import SecurityMiddleware
from api.middleware.error_middleware import ErrorHandlingMiddleware
from datetime import datetime
import logging

# Setup logging
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="FastAPI-based Occupational Therapy Assessment System",
    docs_url=settings.DOCS_URL,
    redoc_url=settings.REDOC_URL,
    openapi_url=settings.OPENAPI_URL
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add middleware in order of execution (outermost to innermost)
# Error handling should be first to catch all errors
app.add_middleware(ErrorHandlingMiddleware)

# Security should be next to block malicious requests early
app.add_middleware(
    SecurityMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS,
    enable_csrf=settings.ENABLE_CSRF,
    enable_xss_protection=True,
    enable_hsts=settings.ENABLE_HSTS,
    frame_deny=True
)

# Rate limiting to prevent abuse
app.add_middleware(
    RateLimitMiddleware,
    rate_limit=settings.RATE_LIMIT,
    time_window=settings.RATE_LIMIT_WINDOW,
    exclude_paths=['/docs', '/openapi.json', '/health']
)

# Size limiting to prevent memory issues
app.add_middleware(
    SizeLimitMiddleware,
    max_content_size=settings.MAX_CONTENT_SIZE,
    max_file_size=settings.MAX_FILE_SIZE,
    excluded_paths=['/docs', '/openapi.json']
)

# Request tracking
app.add_middleware(RequestIDMiddleware)

# Validation middleware
app.add_middleware(ValidationMiddleware)

# Caching (innermost to avoid caching invalid requests)
app.add_middleware(
    ValidationCacheMiddleware,
    ttl=settings.CACHE_TTL,
    maxsize=settings.CACHE_MAX_SIZE
)

# Include routers with prefixes and tags
app.include_router(
    auth.router,
    prefix=settings.API_V1_STR,
    tags=["Authentication"]
)

app.include_router(
    agent.router,
    prefix=f"{settings.API_V1_STR}/agents",
    tags=["Agents"]
)

app.include_router(
    assessment.router,
    prefix=f"{settings.API_V1_STR}/assessments",
    tags=["Assessments"]
)

app.include_router(
    template.router,
    prefix=f"{settings.API_V1_STR}/templates",
    tags=["Templates"]
)

app.include_router(
    assessment_flow.router,
    prefix=f"{settings.API_V1_STR}/assessment-flows",
    tags=["Assessment Flows"]
)

app.include_router(
    error_management.router,
    prefix=f"{settings.API_V1_STR}/errors",
    tags=["Error Management"]
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return await ErrorHandler.handle_exception(request, exc)

@app.on_event("startup")
async def startup_event():
    """Execute startup tasks."""
    logger.info("Starting up Delilah Agentic application")
    logger.info(f"Security features enabled: CSRF={settings.ENABLE_CSRF}, HSTS={settings.ENABLE_HSTS}")
    logger.info(f"Rate limiting: {settings.RATE_LIMIT} requests per {settings.RATE_LIMIT_WINDOW} seconds")
    logger.info(f"Maximum content size: {settings.MAX_CONTENT_SIZE} bytes")
    logger.info(f"Cache TTL: {settings.CACHE_TTL} seconds")
    
    # Initialize error monitoring
    from api.routes.error_management import error_reporter
    error_reporter.setup_default_alerts()

@app.on_event("shutdown")
async def shutdown_event():
    """Execute shutdown tasks."""
    logger.info("Shutting down Delilah Agentic application")

@app.get("/health", tags=["Health"])
async def health_check():
    """Check API health status."""
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to Delilah Agentic API",
        "version": settings.VERSION,
        "documentation": {
            "swagger": settings.DOCS_URL,
            "redoc": settings.REDOC_URL,
            "openapi": settings.OPENAPI_URL
        },
        "features": {
            "csrf_protection": settings.ENABLE_CSRF,
            "rate_limiting": True,
            "request_validation": True,
            "caching": True,
            "error_monitoring": True
        }
    }