from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.agent import router as agent_router
from .core.config import settings

app = FastAPI(
    title="Delilah Agentic API",
    description="Occupational Therapy Field Assessment System API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(agent_router, prefix="/api/v1")