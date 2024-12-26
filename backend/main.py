from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.auth_routes import router as auth_router
from .config import settings
from .database import init_db
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

app = FastAPI(title="Delilah Agentic API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
@app.on_event("startup")
async def startup_event():
    try:
        await init_db()
        logging.info("Database initialized successfully")
    except Exception as e:
        logging.error(f"Error during startup: {e}")
        raise

# Include routers
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])

@app.get("/")
async def root():
    return {"message": "Welcome to Delilah Agentic API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}