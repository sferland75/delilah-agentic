from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from api.dependencies import get_db
from database.repositories.therapist_repository import TherapistRepository

router = APIRouter(prefix="/therapists", tags=["therapists"])

@router.get("/")
def list_therapists(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    repo = TherapistRepository(db)
    return repo.get_all(skip=skip, limit=limit)