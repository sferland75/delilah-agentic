from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from api.routes import agent
from api.core.config import settings
from sqlalchemy.orm import Session
from database.session import SessionLocal, engine
from database.repositories.therapist_repository import TherapistRepository
from database.repositories.client_repository import ClientRepository

app = FastAPI(
    title="Delilah Agentic",
    description="API for managing intelligent agents",
    version="0.1.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency for getting database sessions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Include existing agent router
app.include_router(agent.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Delilah Agentic API"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": settings.API_VERSION,
        "debug": settings.DEBUG
    }

@app.get("/therapists/")
async def get_therapists(db: Session = Depends(get_db)):
    repo = TherapistRepository(db)
    return repo.get_all()

@app.get("/clients/")
async def get_clients(db: Session = Depends(get_db)):
    repo = ClientRepository(db)
    return repo.get_all()