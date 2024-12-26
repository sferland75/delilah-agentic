import re
from typing import Any, Dict, List, Union
from pydantic import BaseModel, ValidationError, validator, Field
from enum import Enum, auto
from datetime import datetime, timedelta

class AssessmentStatus(Enum):
    DRAFT = auto()
    IN_PROGRESS = auto()
    COMPLETED = auto()
    REVIEWED = auto()

class DocumentStatus(Enum):
    DRAFT = auto()
    IN_REVIEW = auto()
    FINALIZED = auto()

class ValidationResult:
    def __init__(self):
        self.errors: List[str] = []
        self.warnings: List[str] = []

    def add_error(self, message: str):
        self.errors.append(message)

    def add_warning(self, message: str):
        self.warnings.append(message)

    @property
    def is_valid(self) -> bool:
        return len(self.errors) == 0

    def __str__(self):
        return f"Validation Errors: {self.errors}\nWarnings: {self.warnings}"

class DataValidationSchema:
    @classmethod
    def validate_assessment_data(cls, data: Dict[str, Any]) -> ValidationResult:
        """
        Comprehensive validation for assessment data
        """
        result = ValidationResult()

        # Validate basic structure
        required_keys = [
            'id', 'assessment_type', 'patient_info', 
            'assessment_details', 'evaluation_scores', 'status'
        ]
        for key in required_keys:
            if key not in data:
                result.add_error(f"Missing required key: {key}")

        # Validate patient info
        if 'patient_info' in data:
            patient_info = data['patient_info']
            
            # Age validation
            if 'age' in patient_info:
                age = patient_info['age']
                if not (18 <= age <= 100):
                    result.add_error(f"Invalid age: {age}. Must be between 18 and 100.")

            # Gender validation
            if 'gender' in patient_info:
                valid_genders = {'Male', 'Female', 'Other'}
                if patient_info['gender'] not in valid_genders:
                    result.add_error(f"Invalid gender: {patient_info['gender']}")

        # Validate assessment type
        valid_assessment_types = {
            'Motor Skills Evaluation', 
            'Cognitive Function Assessment', 
            'Daily Living Activities Screening', 
            'Sensory Processing Assessment', 
            'Neurological Function Test'
        }
        if data.get('assessment_type') not in valid_assessment_types:
            result.add_error(f"Invalid assessment type: {data.get('assessment_type')}")

        # Validate status
        try:
            AssessmentStatus[data.get('status', '').upper()]
        except KeyError:
            result.add_error(f"Invalid assessment status: {data.get('status')}")

        # Validate evaluation scores
        if 'evaluation_scores' in data:
            score_domains = [
                'Fine Motor Skills', 
                'Gross Motor Skills', 
                'Cognitive Processing', 
                'Sensory Integration', 
                'Activity of Daily Living (ADL)'
            ]
            scores = data['evaluation_scores']
            
            for domain in score_domains:
                if domain not in scores:
                    result.add_warning(f"Missing score domain: {domain}")
                else:
                    score = scores[domain]
                    # Validate score structure
                    if not all(key in score for key in ['raw_score', 'percentile', 'interpretation']):
                        result.add_error(f"Incomplete score data for {domain}")
                    
                    # Validate score ranges
                    if score.get('raw_score', 0) < 0 or score.get('raw_score', 0) > 100:
                        result.add_error(f"Invalid raw score for {domain}")
                    
                    if score.get('percentile', 0) < 0 or score.get('percentile', 0) > 100:
                        result.add_error(f"Invalid percentile for {domain}")

        return result

    @classmethod
    def validate_documentation_data(cls, data: Dict[str, Any]) -> ValidationResult:
        """
        Comprehensive validation for documentation data
        """
        result = ValidationResult()

        # Validate basic structure
        required_keys = [
            'id', 'assessment_id', 'document_type', 
            'created_at', 'last_updated', 'content', 'status'
        ]
        for key in required_keys:
            if key not in data:
                result.add_error(f"Missing required key: {key}")

        # Validate document type
        valid_doc_types = {
            'Initial Assessment', 
            'Progress Report', 
            'Comprehensive Evaluation'
        }
        if data.get('document_type') not in valid_doc_types:
            result.add_error(f"Invalid document type: {data.get('document_type')}")

        # Validate status
        try:
            DocumentStatus[data.get('status', '').upper()]
        except KeyError:
            result.add_error(f"Invalid document status: {data.get('status')}")

        # Validate timestamps
        try:
            created_at = datetime.fromisoformat(data.get('created_at', ''))
            last_updated = datetime.fromisoformat(data.get('last_updated', ''))
            
            if last_updated < created_at:
                result.add_error("Last updated timestamp cannot be before creation timestamp")
            
            if created_at > datetime.now():
                result.add_error("Creation timestamp cannot be in the future")
        except ValueError as e:
            result.add_error(f"Invalid timestamp format: {e}")

        # Validate content structure
        if 'content' in data:
            content = data['content']
            required_content_keys = ['summary', 'key_findings', 'recommendations']
            for key in required_content_keys:
                if key not in content:
                    result.add_warning(f"Missing content key: {key}")

        return result

    @classmethod
    def validate_state_transitions(cls, current_state: str, target_state: str, context: str = 'assessment') -> bool:
        """
        Validate state transitions based on context
        """
        # Define valid state transition matrices
        assessment_transitions = {
            'DRAFT': ['IN_PROGRESS', 'COMPLETED', 'REVIEWED'],
            'IN_PROGRESS': ['DRAFT', 'COMPLETED', 'REVIEWED'],
            'COMPLETED': ['REVIEWED', 'IN_PROGRESS'],
            'REVIEWED': ['IN_PROGRESS']
        }

        document_transitions = {
            'DRAFT': ['IN_REVIEW', 'FINALIZED'],
            'IN_REVIEW': ['DRAFT', 'FINALIZED'],
            'FINALIZED': ['IN_REVIEW']
        }

        # Choose appropriate transition matrix
        transitions = assessment_transitions if context == 'assessment' else document_transitions

        # Normalize states
        current_state = current_state.upper()
        target_state = target_state.upper()

        # Check if transition is valid
        return target_state in transitions.get(current_state, [])

def validate_data_pipeline(data: Dict[str, Any]) -> ValidationResult:
    """
    Orchestrate comprehensive data validation
    """
    # Determine data type and apply appropriate validation
    if all(key in data for key in ['assessment_type', 'patient_info', 'status']):
        return DataValidationSchema.validate_assessment_data(data)
    elif all(key in data for key in ['document_type', 'assessment_id', 'status']):
        return DataValidationSchema.validate_documentation_data(data)
    else:
        result = ValidationResult()
        result.add_error("Unable to determine data type for validation")
        return result

# Example usage and testing
def main():
    # Example assessment data
    assessment_data = {
        'id': 'test-assessment-001',
        'assessment_type': 'Motor Skills Evaluation',
        'patient_info': {
            'name': 'John Doe',
            'age': 35,
            'gender': 'Male'
        },
        'assessment_details': {},
        'evaluation_scores': {},
        'status': 'DRAFT'
    }

    # Validate assessment data
    validation_result = validate_data_pipeline(assessment_data)
    
    print("Validation Result:")
    print(validation_result)
    print("Is Valid:", validation_result.is_valid)

    # State transition validation
    print("\nState Transition Validation:")
    print("Draft to In Progress:", 
        DataValidationSchema.validate_state_transitions('DRAFT', 'IN_PROGRESS'))
    print("Completed to Reviewed:", 
        DataValidationSchema.validate_state_transitions('COMPLETED', 'REVIEWED'))
    print("Reviewed to Draft:", 
        DataValidationSchema.validate_state_transitions('REVIEWED', 'DRAFT'))

if __name__ == "__main__":
    main()
