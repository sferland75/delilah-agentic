from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from typing import Optional, Dict, Any, List
from uuid import UUID

from database.models import Documentation, Assessment
from agents.documentation_agent import DocumentationAgent
from api.models.assessment import AssessmentType, DocumentationType

class DocumentationService:
    def __init__(self, db: Session):
        self.db = db
        self.agent = DocumentationAgent()
    
    async def create_documentation(
        self,
        assessment_id: UUID,
        doc_type: DocumentationType,
    ) -> Documentation:
        """Create new documentation for an assessment"""
        try:
            # Verify assessment exists
            assessment = await self.db.query(Assessment).filter(Assessment.id == assessment_id).first()
            if not assessment:
                raise ValueError("Assessment not found")
            
            # Generate documentation with agent
            doc_id = await self.agent.generate_documentation(
                session_id=assessment_id,
                assessment_data=assessment.data
            )
            
            # Create database record
            db_doc = Documentation(
                id=doc_id,
                client_id=assessment.client_id,
                therapist_id=assessment.therapist_id,
                assessment_id=assessment_id,
                doc_type=doc_type,
                content="",  # Will be updated by agent
                doc_metadata={}
            )
            
            self.db.add(db_doc)
            await self.db.commit()
            await self.db.refresh(db_doc)
            
            return db_doc
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise e
    
    async def get_documentation(self, doc_id: UUID) -> Optional[Documentation]:
        """Retrieve documentation by ID"""
        try:
            # Get database record
            db_doc = await self.db.query(Documentation).filter(Documentation.id == doc_id).first()
            if not db_doc:
                return None
            
            # Get agent state
            agent_doc = await self.agent.get_documentation(doc_id)
            if agent_doc:
                db_doc.content = agent_doc["content"]
                db_doc.doc_metadata = {
                    **db_doc.doc_metadata,
                    "agent_state": agent_doc["metadata"]
                }
            
            return db_doc
        except SQLAlchemyError as e:
            raise e
    
    async def update_documentation(
        self,
        doc_id: UUID,
        updates: Dict[str, Any]
    ) -> Documentation:
        """Update existing documentation"""
        try:
            doc = await self.get_documentation(doc_id)
            if not doc:
                raise ValueError("Documentation not found")
            
            # Update through agent
            await self.agent.update_documentation(
                session_id=doc.assessment_id,
                step_data=updates
            )
            
            # Get updated state
            agent_doc = await self.agent.get_documentation(doc_id)
            if agent_doc:
                doc.content = agent_doc["content"]
                doc.doc_metadata = {
                    **doc.doc_metadata,
                    "agent_state": agent_doc["metadata"]
                }
            
            doc.updated_at = datetime.utcnow()
            await self.db.commit()
            await self.db.refresh(doc)
            
            return doc
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise e
    
    async def finalize_documentation(self, doc_id: UUID) -> Documentation:
        """Finalize documentation for signing"""
        try:
            doc = await self.get_documentation(doc_id)
            if not doc:
                raise ValueError("Documentation not found")
            
            # Finalize through agent
            agent_doc = await self.agent.finalize_documentation(doc_id)
            
            # Update database record
            doc.content = agent_doc["content"]
            doc.doc_metadata = {
                **doc.doc_metadata,
                "agent_state": agent_doc["metadata"],
                "finalized_at": datetime.utcnow()
            }
            doc.updated_at = datetime.utcnow()
            
            await self.db.commit()
            await self.db.refresh(doc)
            
            return doc
        except SQLAlchemyError as e:
            await self.db.rollback()
            raise e