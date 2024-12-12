from fastapi import APIRouter

from .assessments import router as assessment_router

api_router = APIRouter()
api_router.include_router(assessment_router, prefix="/assessments", tags=["assessments"])