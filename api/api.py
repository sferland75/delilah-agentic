from fastapi import APIRouter
from api.endpoints import client, therapist

api_router = APIRouter()

api_router.include_router(client.router, prefix="/clients", tags=["clients"])
api_router.include_router(therapist.router, prefix="/therapists", tags=["therapists"])