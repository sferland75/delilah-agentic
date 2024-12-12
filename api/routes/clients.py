from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from uuid import UUID

from ..models.client import Client, ClientCreate, ClientUpdate
from ..dependencies import get_coordinator
from coordinator import AgentCoordinator

router = APIRouter()

@router.post("/", response_model=Client)
async def create_client(
    client: ClientCreate,
    coordinator: AgentCoordinator = Depends(get_coordinator)
):
    """Create a new client"""
    try:
        return await coordinator.client_manager.create_client(client)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{client_id}", response_model=Client)
async def get_client(
    client_id: UUID,
    coordinator: AgentCoordinator = Depends(get_coordinator)
):
    """Get client by ID"""
    try:
        client = await coordinator.client_manager.get_client(client_id)
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        return client
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[Client])
async def list_clients(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    search: Optional[str] = None,
    coordinator: AgentCoordinator = Depends(get_coordinator)
):
    """List clients with optional search"""
    try:
        return await coordinator.client_manager.list_clients(skip, limit, search)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{client_id}", response_model=Client)
async def update_client(
    client_id: UUID,
    client_update: ClientUpdate,
    coordinator: AgentCoordinator = Depends(get_coordinator)
):
    """Update client information"""
    try:
        client = await coordinator.client_manager.update_client(client_id, client_update)
        if not client:
            raise HTTPException(status_code=404, detail="Client not found")
        return client
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{client_id}")
async def delete_client(
    client_id: UUID,
    coordinator: AgentCoordinator = Depends(get_coordinator)
):
    """Soft delete a client"""
    try:
        await coordinator.client_manager.delete_client(client_id)
        return {"status": "success", "message": "Client deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))