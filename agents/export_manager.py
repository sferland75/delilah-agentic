from datetime import datetime
from typing import Dict, List
from uuid import UUID
import csv
import io
from .templates.iha_template import IHAReport

class ExportManager:
    def __init__(self, client_manager, assessment_coordinator):
        self.client_manager = client_manager
        self.assessment_coordinator = assessment_coordinator
        self.iha_template = IHAReport()

    async def generate_iha_report(self, client_id: UUID, assessment_id: UUID) -> str:
        # Get client data
        client = await self.client_manager.get_client(client_id)
        if not client:
            raise ValueError('Client not found')

        # Get assessment data
        assessment = await self.assessment_coordinator.get_assessment(assessment_id)
        if not assessment:
            raise ValueError('Assessment not found')

        # Mock therapist data - in real implementation, this would come from a therapist service
        therapist_data = {
            'name': 'Sebastian Ferland',
            'registration': 'REG12345',
            'qualifications': ['Registered Occupational Therapist']
        }

        # Prepare client data
        client_data = {
            'name': f"{client.first_name} {client.last_name}",
            'dob': client.date_of_birth.strftime('%Y-%m-%d'),
            'address': client.contact_info.get('address', ''),
            'phone': client.contact_info.get('phone', ''),
            'claim_number': assessment.claim_number if hasattr(assessment, 'claim_number') else ''
        }

        # Generate report using template
        return await self.iha_template.generate(
            client_data=client_data,
            assessment_data=assessment.to_dict(),
            therapist_data=therapist_data
        )