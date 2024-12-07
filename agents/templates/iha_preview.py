from typing import Dict, List

class IHAPreview:
    @staticmethod
    def get_available_templates() -> List[Dict]:
        return [
            {'id': 'standard', 'name': 'Standard Template', 'description': 'Default IHA report format'},
            {'id': 'detailed', 'name': 'Detailed Template', 'description': 'Extended format with additional sections'},
            {'id': 'concise', 'name': 'Concise Template', 'description': 'Abbreviated format for quick assessments'}
        ]

    @staticmethod
    def get_section_options() -> Dict:
        return {
            'demographics': {
                'title': 'Demographics',
                'optional_fields': ['lawyer', 'firm', 'adjuster'],
                'layouts': ['standard', 'compact']
            },
            'clinical_history': {
                'title': 'Clinical History',
                'optional_fields': ['pre_existing_conditions', 'family_history'],
                'layouts': ['timeline', 'categorical']
            },
            'functional_observations': {
                'title': 'Functional Observations',
                'optional_fields': ['photos', 'measurements', 'diagrams'],
                'layouts': ['tabular', 'narrative']
            },
            'environmental': {
                'title': 'Environmental Assessment',
                'optional_fields': ['floor_plan', 'photos', 'measurements'],
                'layouts': ['room_by_room', 'accessibility_focused']
            },
            'recommendations': {
                'title': 'Recommendations',
                'optional_fields': ['cost_estimates', 'vendor_options', 'timelines'],
                'layouts': ['priority_based', 'timeline_based', 'category_based']
            }
        }

    @staticmethod
    async def generate_preview(client_data: Dict, assessment_data: Dict, therapist_data: Dict, 
                             template_id: str = 'standard', section_preferences: Dict = None) -> Dict:
        """Generate a structured preview of the IHA report with customization"""
        base_preview = {
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
                    'editable': ['date_of_loss', 'address'],
                    'layout': section_preferences.get('demographics', {}).get('layout', 'standard'),
                    'optional_fields': section_preferences.get('demographics', {}).get('optional_fields', [])
                },
                # ... other sections with similar customization
            ],
            'metadata': {
                'therapist': therapist_data.get('name'),
                'registration': therapist_data.get('registration'),
                'assessment_date': assessment_data.get('date'),
                'template': template_id,
                'customizations': section_preferences
            }
        }

        return base_preview