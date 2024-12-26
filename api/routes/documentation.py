from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from typing import Dict, Any
from uuid import UUID

from api.models.assessment import DocumentationType
from api.services.documentation.service import DocumentationService
from api.deps import get_documentation_service

router = APIRouter()

@router.post("/{assessment_id}", 
    status_code=status.HTTP_201_CREATED,
    description="Create new documentation for an assessment"
)
async def create_documentation(
    assessment_id: UUID,
    doc_type: DocumentationType,
    service: DocumentationService = Depends(get_documentation_service)
):
    """Create new documentation for an assessment"""
    try:
        doc = await service.create_documentation(
            assessment_id=assessment_id,
            doc_type=doc_type
        )
        return {
            "id": doc.id,
            "status": "created",
            "message": "Documentation created successfully"
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.get("/{doc_id}",
    description="Get documentation by ID"
)
async def get_documentation(
    doc_id: UUID,
    service: DocumentationService = Depends(get_documentation_service)
):
    """Retrieve documentation by ID"""
    try:
        doc = await service.get_documentation(doc_id)
        if not doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Documentation not found"
            )
        return doc
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.put("/{doc_id}",
    description="Update documentation content"
)
async def update_documentation(
    doc_id: UUID,
    updates: Dict[str, Any],
    service: DocumentationService = Depends(get_documentation_service)
):
    """Update existing documentation"""
    try:
        doc = await service.update_documentation(doc_id, updates)
        return doc
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

@router.post("/{doc_id}/finalize",
    description="Finalize documentation for signing"
)
async def finalize_documentation(
    doc_id: UUID,
    service: DocumentationService = Depends(get_documentation_service)
):
    """Finalize documentation for signing"""
    try:
        doc = await service.finalize_documentation(doc_id)
        return {
            "id": doc.id,
            "status": "finalized",
            "message": "Documentation finalized successfully",
            "finalized_at": doc.doc_metadata.get("finalized_at")
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )