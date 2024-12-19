from fastapi import APIRouter

from .assessments import router as assessment_router
from .clients import router as client_router
from .therapists import router as therapist_router

api_router = APIRouter()

api_router.include_router(assessment_router, prefix="/assessments", tags=["assessments"])
api_router.include_router(client_router, prefix="/clients", tags=["clients"])
api_router.include_router(therapist_router, prefix="/therapists", tags=["therapists"])