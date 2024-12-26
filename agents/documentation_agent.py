import asyncio
from typing import Dict, Any, Optional, List
from uuid import UUID
from datetime import datetime
from api.models.assessment import AssessmentType, AssessmentStatus
import logging

logger = logging.getLogger(__name__)

class DocumentationAgent:
    def __init__(self):
        self.message_queue: asyncio.Queue = asyncio.Queue()
        self.active_documents: Dict[UUID, Dict[str, Any]] = {}
        self.templates: Dict[str, str] = self._load_templates()
    
    def _load_templates(self) -> Dict[str, str]:
        """Load documentation templates"""
        return {
            "initial_evaluation": """
OCCUPATIONAL THERAPY INITIAL EVALUATION

Date: {date}
Client Name: {client_name}
Date of Birth: {dob}
Therapist: {therapist_name}

MEDICAL HISTORY
{medical_history}

CURRENT FUNCTIONAL STATUS
ADL Status: {adl_status}
Mobility Status: {mobility_status}
Cognitive Status: {cognitive_status}

ASSESSMENT FINDINGS
{assessment_findings}

GOALS
Short-term Goals:
{short_term_goals}

Long-term Goals:
{long_term_goals}

TREATMENT PLAN
{treatment_plan}

Therapist Signature: _________________
Date: {date}
            """,
            "progress_note": """
OCCUPATIONAL THERAPY PROGRESS NOTE

Date: {date}
Client Name: {client_name}
Session Number: {session_number}

PROGRESS TOWARD GOALS
{progress_notes}

CURRENT STATUS
{current_status}

PLAN FOR NEXT SESSION
{next_session_plan}

Therapist Signature: _________________
Date: {date}
            """
        }

    async def process_message(self, message: Dict[str, Any]) -> None:
        """Process incoming messages from assessment agent"""
        try:
            if message["type"] == "assessment_completed":
                await self.generate_documentation(
                    session_id=message["session_id"],
                    assessment_data=message.get("data", {})
                )
            elif message["type"] == "step_completed":
                await self.update_documentation(
                    session_id=message["session_id"],
                    step_data=message.get("data", {})
                )
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}")
            raise

    async def generate_documentation(
        self,
        session_id: UUID,
        assessment_data: Dict[str, Any]
    ) -> UUID:
        """Generate initial documentation for an assessment"""
        try:
            doc_id = UUID(int=len(self.active_documents) + 1)
            
            # Create document structure
            document = {
                "session_id": session_id,
                "status": "draft",
                "content": "",
                "metadata": {
                    "created_at": datetime.utcnow(),
                    "last_updated": datetime.utcnow(),
                    "version": 1
                },
                "history": []
            }
            
            # Select template based on assessment type
            template = self.templates.get(
                assessment_data.get("type", "initial_evaluation"),
                self.templates["initial_evaluation"]
            )
            
            # Generate initial content
            document["content"] = template.format(
                date=datetime.utcnow().strftime("%Y-%m-%d"),
                **assessment_data
            )
            
            self.active_documents[doc_id] = document
            
            # Notify that documentation has been created
            await self.message_queue.put({
                "type": "documentation_created",
                "doc_id": doc_id,
                "session_id": session_id,
                "timestamp": datetime.utcnow()
            })
            
            return doc_id
        except Exception as e:
            logger.error(f"Error generating documentation: {str(e)}")
            raise

    async def update_documentation(
        self,
        session_id: UUID,
        step_data: Dict[str, Any]
    ) -> None:
        """Update existing documentation with new data"""
        try:
            # Find document for session
            doc = next(
                (doc for doc in self.active_documents.values() 
                 if doc["session_id"] == session_id),
                None
            )
            
            if not doc:
                raise ValueError(f"No documentation found for session {session_id}")
            
            # Save current version to history
            doc["history"].append({
                "content": doc["content"],
                "metadata": doc["metadata"].copy(),
                "timestamp": datetime.utcnow()
            })
            
            # Update content with new data
            # This is a simplified update - in practice, you'd want more sophisticated
            # document merging logic
            doc["content"] = self._merge_content(doc["content"], step_data)
            
            # Update metadata
            doc["metadata"]["last_updated"] = datetime.utcnow()
            doc["metadata"]["version"] += 1
            
            # Notify that documentation has been updated
            await self.message_queue.put({
                "type": "documentation_updated",
                "session_id": session_id,
                "timestamp": datetime.utcnow()
            })
        except Exception as e:
            logger.error(f"Error updating documentation: {str(e)}")
            raise

    def _merge_content(self, existing_content: str, new_data: Dict[str, Any]) -> str:
        """Merge new data into existing document content"""
        # This is a simplified merge - in practice, you'd want more sophisticated
        # document merging logic based on your specific needs
        template_vars = {
            k: str(v) for k, v in new_data.items()
            if isinstance(k, str) and v is not None
        }
        return existing_content.format(**template_vars)

    async def get_documentation(self, doc_id: UUID) -> Optional[Dict[str, Any]]:
        """Retrieve documentation by ID"""
        return self.active_documents.get(doc_id)

    async def finalize_documentation(self, doc_id: UUID) -> Dict[str, Any]:
        """Finalize documentation for signing"""
        try:
            doc = await self.get_documentation(doc_id)
            if not doc:
                raise ValueError(f"Documentation not found: {doc_id}")
            
            if doc["status"] == "finalized":
                raise ValueError("Documentation already finalized")
            
            # Update status
            doc["status"] = "finalized"
            doc["metadata"]["finalized_at"] = datetime.utcnow()
            
            # Notify that documentation has been finalized
            await self.message_queue.put({
                "type": "documentation_finalized",
                "doc_id": doc_id,
                "session_id": doc["session_id"],
                "timestamp": datetime.utcnow()
            })
            
            return doc
        except Exception as e:
            logger.error(f"Error finalizing documentation: {str(e)}")
            raise