from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from uuid import UUID

from app.database.database import get_db
from app.models.documentation import Documentation
from app.models.client import Client
from app.models.therapist import Therapist
from app.models.assessment import Assessment
from app.schemas.documentation import (
    DocumentationCreate,
    DocumentationResponse,
    DocumentationUpdate,
    DocumentationType
)

router = APIRouter(prefix="/documentation", tags=["documentation"])

@router.post("/", response_model=DocumentationResponse, status_code=status.HTTP_201_CREATED)
async def create_documentation(
    doc: DocumentationCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new documentation record"""
    # Verify client exists
    client_query = select(Client).where(Client.id == doc.client_id)
    client_result = await db.execute(client_query)
    if not client_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )

    # Verify therapist exists
    therapist_query = select(Therapist).where(Therapist.id == doc.therapist_id)
    therapist_result = await db.execute(therapist_query)
    if not therapist_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Therapist not found"
        )

    # Verify assessment exists if provided
    if doc.assessment_id:
        assessment_query = select(Assessment).where(Assessment.id == doc.assessment_id)
        assessment_result = await db.execute(assessment_query)
        if not assessment_result.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assessment not found"
            )

    db_doc = Documentation(
        client_id=doc.client_id,
        therapist_id=doc.therapist_id,
        assessment_id=doc.assessment_id,
        doc_type=doc.doc_type,
        content=doc.content,
        meta_info=doc.meta_info.dict()
    )
    
    db.add(db_doc)
    await db.commit()
    await db.refresh(db_doc)
    return db_doc

@router.get("/{doc_id}", response_model=DocumentationResponse)
async def get_documentation(
    doc_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a documentation record by ID"""
    query = select(Documentation).where(Documentation.id == doc_id)
    result = await db.execute(query)
    doc = result.scalar_one_or_none()
    
    if doc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Documentation not found"
        )
    return doc

@router.get("/", response_model=List[DocumentationResponse])
async def list_documentation(
    skip: int = 0,
    limit: int = 100,
    doc_type: Optional[DocumentationType] = None,
    client_id: Optional[UUID] = None,
    therapist_id: Optional[UUID] = None,
    assessment_id: Optional[UUID] = None,
    db: AsyncSession = Depends(get_db)
):
    """List documentation records with optional filtering"""
    query = select(Documentation)
    
    if doc_type:
        query = query.where(Documentation.doc_type == doc_type)
    if client_id:
        query = query.where(Documentation.client_id == client_id)
    if therapist_id:
        query = query.where(Documentation.therapist_id == therapist_id)
    if assessment_id:
        query = query.where(Documentation.assessment_id == assessment_id)
        
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    docs = result.scalars().all()
    return docs

@router.patch("/{doc_id}", response_model=DocumentationResponse)
async def update_documentation(
    doc_id: UUID,
    doc_update: DocumentationUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update a documentation record"""
    query = select(Documentation).where(Documentation.id == doc_id)
    result = await db.execute(query)
    db_doc = result.scalar_one_or_none()
    
    if db_doc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Documentation not found"
        )
    
    update_data = doc_update.dict(exclude_unset=True)
    
    # Handle meta_info updates
    if "meta_info" in update_data and update_data["meta_info"] is not None:
        current_meta = db_doc.meta_info or {}
        current_meta.update(update_data["meta_info"].dict(exclude_unset=True))
        update_data["meta_info"] = current_meta
    
    for field, value in update_data.items():
        setattr(db_doc, field, value)
    
    await db.commit()
    await db.refresh(db_doc)
    return db_doc

@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_documentation(
    doc_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """Delete a documentation record"""
    query = select(Documentation).where(Documentation.id == doc_id)
    result = await db.execute(query)
    doc = result.scalar_one_or_none()
    
    if doc is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Documentation not found"
        )
    
    await db.delete(doc)
    await db.commit()
    return None