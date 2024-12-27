from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.api import patients, assessments
from .database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Delilah Agentic API",
    description="Clinical management system with AI-assisted analysis",
    version="0.1.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(patients.router, prefix="/api/patients", tags=["patients"])
app.include_router(assessments.router, prefix="/api/assessments", tags=["assessments"])