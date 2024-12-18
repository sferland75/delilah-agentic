from fastapi import APIRouter
from .clients import router as client_router
from .therapists import router as therapist_router
from .assessments import router as assessment_router
from .documentation import router as documentation_router
from .reports import router as report_router

router = APIRouter()
router.include_router(client_router)
router.include_router(therapist_router)
router.include_router(assessment_router)
router.include_router(documentation_router)
router.include_router(report_router)