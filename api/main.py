from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.core.config import settings
from api.routes import clients, therapists, assessments

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include routers
app.include_router(clients.router, prefix="/api/v1", tags=["clients"])
app.include_router(therapists.router, prefix="/api/v1", tags=["therapists"])
app.include_router(assessments.router, prefix="/api/v1", tags=["assessments"])
