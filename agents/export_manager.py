from datetime import datetime, timedelta
from typing import Dict, List
from uuid import UUID
import csv
import io

class ExportManager:
    def __init__(self, client_manager, assessment_coordinator):
        self.client_manager = client_manager
        self.assessment_coordinator = assessment_coordinator

    async def generate_progress_report(self, client_ids: List[UUID], date_range: Dict) -> str:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['Client Name', 'Assessment Date', 'Type', 'Progress Notes', 'Recommendations'])

        for client_id in client_ids:
            client = await self.client_manager.get_client(client_id)
            if not client:
                continue

            assessments = await self.client_manager.get_client_assessments(client_id)
            for assessment_id in assessments:
                assessment = await self.assessment_coordinator.get_assessment(assessment_id)
                if assessment:
                    writer.writerow([
                        f"{client.first_name} {client.last_name}",
                        assessment.date.strftime('%Y-%m-%d'),
                        assessment.type,
                        assessment.notes,
                        assessment.recommendations
                    ])

        return output.getvalue()

    async def generate_insurance_report(self, client_ids: List[UUID]) -> str:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['Client Name', 'DOB', 'Assessment Date', 'Functional Status', 'Goals Met', 'Continuing Goals'])

        for client_id in client_ids:
            client = await self.client_manager.get_client(client_id)
            if not client:
                continue

            assessments = await self.client_manager.get_client_assessments(client_id)
            for assessment_id in assessments:
                assessment = await self.assessment_coordinator.get_assessment(assessment_id)
                if assessment:
                    writer.writerow([
                        f"{client.first_name} {client.last_name}",
                        client.date_of_birth.strftime('%Y-%m-%d'),
                        assessment.date.strftime('%Y-%m-%d'),
                        assessment.functional_status,
                        assessment.goals_met,
                        assessment.continuing_goals
                    ])

        return output.getvalue()

    async def generate_group_summary(self, program: str, date_range: Dict) -> str:
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(['Program', 'Date', 'Total Participants', 'Average Progress', 'Key Observations'])

        # In a real implementation, this would aggregate actual group session data
        writer.writerow([program, datetime.now().strftime('%Y-%m-%d'), 5, '75%', 'Good group participation'])

        return output.getvalue()