from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID

from app.database.database import get_db
from app.models.client import Client
from app.schemas.client import ClientCreate, ClientResponse, ClientUpdate

router = APIRouter(prefix="/clients", tags=["clients"])

@router.post("/", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
async def create_client(
    client: ClientCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new client"""
    db_client = Client(
        first_name=client.first_name,
        last_name=client.last_name,
        date_of_birth=client.date_of_birth,
        contact_info=client.contact_info.dict(),
        medical_history=client.medical_history.dict() if client.medical_history else None,
        active=True
    )
    
    db.add(db_client)
    await db.commit()
    await db.refresh(db_client)
    return db_client

@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(
    client_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a client by ID"""
    query = select(Client).where(Client.id == client_id)
    result = await db.execute(query)
    client = result.scalar_one_or_none()
    
    if client is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    return client

@router.get("/", response_model=List[ClientResponse])
async def list_clients(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    db: AsyncSession = Depends(get_db)
):
    """List all clients with pagination"""
    query = select(Client)
    if active_only:
        query = query.where(Client.active == True)
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    clients = result.scalars().all()
    return clients

@router.patch("/{client_id}", response_model=ClientResponse)
async def update_client(
    client_id: UUID,
    client_update: ClientUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a client"""
    query = select(Client).where(Client.id == client_id)
    result = await db.execute(query)
    db_client = result.scalar_one_or_none()
    
    if db_client is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    update_data = client_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        # Handle nested JSON fields
        if field in ["contact_info", "medical_history"] and value is not None:
            current_value = getattr(db_client, field) or {}
            current_value.update(value.dict(exclude_unset=True))
            setattr(db_client, field, current_value)
        else:
            setattr(db_client, field, value)
    
    await db.commit()
    await db.refresh(db_client)
    return db_client

@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_client(
    client_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Soft delete a client"""
    query = select(Client).where(Client.id == client_id)
    result = await db.execute(query)
    client = result.scalar_one_or_none()
    
    if client is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    client.active = False
    await db.commit()
    return None