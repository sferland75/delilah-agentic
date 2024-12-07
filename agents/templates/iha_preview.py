from typing import Dict

class IHAPreview:
    @staticmethod
    async def generate_preview(client_data: Dict, assessment_data: Dict, therapist_data: Dict) -> Dict:
        """Generate a structured preview of the IHA report"""
        return {
            'sections': [
                {
                    'title': 'Demographics',
                    'content': {
                        'Client Name': client_data.get('name'),
                        'Date of Loss': client_data.get('date_of_loss'),
                        'Address': client_data.get('address'),
                        'Date of Birth': client_data.get('dob'),
                        'Claim Number': client_data.get('claim_number')
                    },
                    'editable': ['date_of_loss', 'address']
                },
                {
                    'title': 'Clinical History',
                    'content': assessment_data.get('clinical_history', {}),
                    'editable': ['pre_accident', 'mechanism_of_injury', 'nature_of_injury']
                },
                {
                    'title': 'Functional Observations',
                    'content': assessment_data.get('functional_observations', {}),
                    'editable': ['tolerances', 'mobility', 'transfers']
                },
                {
                    'title': 'Environmental Assessment',
                    'content': assessment_data.get('environmental', {}),
                    'editable': ['dwelling_type', 'rooms', 'accessibility']
                },
                {
                    'title': 'Recommendations',
                    'content': assessment_data.get('recommendations', {}),
                    'editable': ['immediate', 'short_term', 'long_term']
                }
            ],
            'metadata': {
                'therapist': therapist_data.get('name'),
                'registration': therapist_data.get('registration'),
                'assessment_date': assessment_data.get('date')
            }
        }