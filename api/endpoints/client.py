from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from api.dependencies.database import get_db
from api.crud.crud_client import client
from api.schemas.client import Client, ClientCreate, ClientUpdate

router = APIRouter()

@router.get("/", response_model=List[Client])
async def read_clients(
    db: AsyncSession = Depends(get_db),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Retrieve all clients.
    """
    clients = await client.get_multi(db, skip=skip, limit=limit)
    return clients

@router.post("/", response_model=Client)
async def create_client(
    *,
    db: AsyncSession = Depends(get_db),
    client_in: ClientCreate
) -> Any:
    """
    Create new client.
    """
    if client_in.email:
        existing_client = await client.get_by_email(db, email=client_in.email)
        if existing_client:
            raise HTTPException(
                status_code=400,
                detail="A client with this email already exists."
            )
    return await client.create(db, obj_in=client_in)

@router.put("/{client_id}", response_model=Client)
async def update_client(
    *,
    db: AsyncSession = Depends(get_db),
    client_id: str,
    client_in: ClientUpdate
) -> Any:
    """
    Update a client.
    """
    existing_client = await client.get(db, id=client_id)
    if not existing_client:
        raise HTTPException(
            status_code=404,
            detail="Client not found"
        )
    return await client.update(db, db_obj=existing_client, obj_in=client_in)

@router.get("/{client_id}", response_model=Client)
async def read_client(
    *,
    db: AsyncSession = Depends(get_db),
    client_id: str
) -> Any:
    """
    Get client by ID.
    """
    existing_client = await client.get(db, id=client_id)
    if not existing_client:
        raise HTTPException(
            status_code=404,
            detail="Client not found"
        )
    return existing_client

@router.delete("/{client_id}", response_model=Client)
async def delete_client(
    *,
    db: AsyncSession = Depends(get_db),
    client_id: str
) -> Any:
    """
    Delete a client.
    """
    existing_client = await client.get(db, id=client_id)
    if not existing_client:
        raise HTTPException(
            status_code=404,
            detail="Client not found"
        )
    return await client.remove(db, id=client_id)