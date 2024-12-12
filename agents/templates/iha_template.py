from datetime import datetime
from typing import Dict, List, Optional
from dataclasses import dataclass

@dataclass
class AssessmentSection:
    title: str
    required: bool = True
    content: str = ""

class InHomeAssessmentTemplate:
    """Template for Occupational Therapy In-Home Assessments"""
    
    VERSION = "1.0"
    
    # Define all possible sections in order
    SECTIONS = [
        "header",
        "demographics",
        "therapist_qualifications",
        "summary_findings",
        "recommendations",
        "informed_consent",
        "documentation_reviewed",
        "pre_accident_medical_history",
        "mechanism_of_injury",
        "nature_of_injury",
        "course_of_recovery",
        "current_medical_team",
        "medication",
        "subjective_information",
        "functional_observations",
        "range_of_motion",
        "emotional_presentation",
        "cognitive_presentation",
        "typical_day",
        "environmental_assessment",
        "living_arrangements",
        "activities_daily_living",
        "attendant_care_needs",
        "closing_comments"
    ]

    def __init__(self):
        self.report_date = datetime.now()
        self.page_number = 1
        self.total_pages = None

    async def generate(self, 
                      client_data: Dict,
                      assessment_data: Dict,
                      therapist_data: Dict) -> Dict:
        """Generate the complete assessment report"""
        
        report = {
            'metadata': self._generate_metadata(client_data, therapist_data),
            'sections': {}
        }

        # Generate each section
        for section in self.SECTIONS:
            method_name = f'_generate_{section}'
            if hasattr(self, method_name):
                report['sections'][section] = await getattr(self, method_name)(
                    client_data,
                    assessment_data,
                    therapist_data
                )

        return report

    def _generate_metadata(self, client_data: Dict, therapist_data: Dict) -> Dict:
        return {
            'report_date': self.report_date.strftime('%Y-%m-%d'),
            'template_version': self.VERSION,
            'client_name': client_data.get('name'),
            'claim_number': client_data.get('claim_number'),
            'referral_number': client_data.get('referral_number'),
            'therapist_name': therapist_data.get('name'),
            'therapist_credentials': therapist_data.get('credentials')
        }

    def _generate_header(self, client_data: Dict, assessment_data: Dict, therapist_data: Dict) -> Dict:
        return {
            'title': 'OCCUPATIONAL THERAPY IN-HOME ASSESSMENT',
            'company_info': {
                'phone': '(613) 776-1266',
                'website': 'www.ferlandassociates.com',
                'email': 'info@ferlandassociates.com',
                'tagline': 'Proudly Serving Eastern Ontario Since 2014'
            }
        }

    def _generate_demographics(self, client_data: Dict, assessment_data: Dict, therapist_data: Dict) -> Dict:
        return {
            'client_info': {
                'name': client_data.get('name'),
                'address': client_data.get('address'),
                'telephone': client_data.get('phone'),
                'date_of_loss': client_data.get('date_of_loss'),
                'date_of_birth': client_data.get('dob')
            },
            'legal_info': {
                'lawyer': client_data.get('lawyer'),
                'firm': client_data.get('law_firm')
            },
            'insurance_info': {
                'adjuster': client_data.get('adjuster'),
                'insurer': client_data.get('insurer'),
                'claim_number': client_data.get('claim_number')
            },
            'assessment_info': {
                'therapist': f"{therapist_data.get('name')} OT Reg.(Ont.)",
                'registration': therapist_data.get('registration'),
                'assessment_date': assessment_data.get('date'),
                'report_date': self.report_date.strftime('%Y-%m-%d')
            }
        }

    def format_report(self, report_data: Dict) -> str:
        """Format the report data into the standard template format"""
        formatted = []
        
        # Add header
        formatted.append(self._format_header(report_data['sections']['header']))
        
        # Add demographics table
        formatted.append(self._format_demographics(report_data['sections']['demographics']))
        
        # Add remaining sections
        for section in self.SECTIONS[2:]:
            if section in report_data['sections']:
                formatted.append(self._format_section(
                    section, 
                    report_data['sections'][section]
                ))
        
        return '\n\n'.join(formatted)
