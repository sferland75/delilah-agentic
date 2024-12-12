from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import api_router

app = FastAPI(
    title="Delilah Agentic API",
    description="Occupational Therapy Assessment System API",
    version="0.1.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add routers
app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}