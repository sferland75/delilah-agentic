# api/routes/client.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db
from database.repositories.client_repository import ClientRepository

router = APIRouter()

@router.get("/clients/")
async def get_clients(db: Session = Depends(get_db)):
    repo = ClientRepository(db)
    return repo.get_all()