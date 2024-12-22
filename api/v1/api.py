from fastapi import APIRouter
from monitoring.learning_metrics import router as learning_metrics_router

api_router = APIRouter()

# Include existing routers
# ... (keep existing router includes)

# Add learning metrics monitoring
api_router.include_router(
    learning_metrics_router,
    prefix="/monitoring",
    tags=["monitoring"]
)