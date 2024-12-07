from datetime import datetime
from typing import Dict, Optional
from uuid import UUID

class IHAReport:
    def __init__(self):
        self.sections = [
            'demographics',
            'documentation_reviewed',
            'clinical_history',
            'current_status',
            'symptoms',
            'functional_observations',
            'range_of_motion',
            'environmental',
            'adl_assessment',
            'attendant_care',
            'recommendations',
            'summary'
        ]

    async def generate(self, 
                      client_data: Dict,
                      assessment_data: Dict,
                      therapist_data: Dict) -> str:
        report = []
        
        # Header
        report.append('OCCUPATIONAL THERAPY IN-HOME ASSESSMENT\n')

        # Demographics
        report.append('DEMOGRAPHIC AND REFERRAL INFORMATION\n')
        demo_table = [
            ['Client Name:', client_data.get('name', ''), 'Date of Loss:', client_data.get('date_of_loss', '')],
            ['Address:', client_data.get('address', ''), 'Date of Birth:', client_data.get('dob', '')],
            ['Telephone #:', client_data.get('phone', '')],
            ['Lawyer:', client_data.get('lawyer', ''), 'Firm:', client_data.get('law_firm', '')],
            ['Adjuster:', client_data.get('adjuster', ''), 'Insurer:', client_data.get('insurer', '')],
            ['Claim No.:', client_data.get('claim_number', '')],
            ['Therapist:', therapist_data.get('name', ''), 'Date of Assessment:', assessment_data.get('date', '')],
            ['Registration #:', therapist_data.get('registration', ''), 'Date of Report:', datetime.now().strftime('%Y-%m-%d')]
        ]
        report.extend(self._format_table(demo_table))

        # Clinical History
        if assessment_data.get('clinical_history'):
            report.append('\nCOMPREHENSIVE CLINICAL HISTORY\n')
            history = assessment_data['clinical_history']
            report.append('Pre-Accident Medical History\n')
            history_table = [
                ['Medical Condition', 'Treatment History', 'Impact on Function', 'Current Status']
            ]
            for condition in history.get('pre_accident', []):
                history_table.append([
                    condition.get('condition', ''),
                    condition.get('treatment', ''),
                    condition.get('impact', ''),
                    condition.get('status', '')
                ])
            report.extend(self._format_table(history_table))

        # Continue for each section...
        # This is a simplified version - full implementation would include all sections

        return '\n'.join(report)

    def _format_table(self, data: list) -> list:
        """Format a list of lists into a text table"""
        if not data:
            return []

        # Calculate column widths
        cols = len(data[0])
        widths = [0] * cols
        for row in data:
            for i, cell in enumerate(row):
                widths[i] = max(widths[i], len(str(cell)))

        # Format rows
        formatted = []
        for row in data:
            formatted_row = '  '.join(str(cell).ljust(widths[i]) for i, cell in enumerate(row))
            formatted.append(formatted_row)

        return formatted