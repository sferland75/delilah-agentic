import pytest
import sys
from pathlib import Path
import json
from typing import Dict, Any

# Add project root to Python path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

# Import local modules
from tests.data_generator import TestDataGenerator
from tests.data_validation_framework import validate_data_pipeline
from tests.error_handling_system import ErrorHandler, ErrorCategory
from tests.database_import import DatabaseImporter, Assessment, Documentation, Analysis, Report

class IntegrationTestSuite:
    """
    Comprehensive integration test suite for Delilah Agentic system
    """
    def __init__(self, test_data_path=None):
        """
        Initialize integration test suite
        """
        # Use provided test data path or generate new data
        if test_data_path is None:
            generator = TestDataGenerator()
            batch_data = generator.generate_batch_data(num_assessments=20)
            self.test_data_path = PROJECT_ROOT / 'tests' / 'test_data_batch.json'
            with open(self.test_data_path, 'w') as f:
                json.dump(batch_data, f, indent=2)
        else:
            self.test_data_path = test_data_path
        
        # Initialize error handler
        self.error_handler = ErrorHandler()
        
        # Initialize database importer
        self.db_importer = DatabaseImporter()

    def test_data_generation_and_validation(self):
        """
        Test the entire data generation and validation workflow
        """
        # Load test data
        with open(self.test_data_path, 'r') as f:
            test_data = json.load(f)
        
        # Validate assessments
        for assessment in test_data['assessments']:
            validation_result = validate_data_pipeline(assessment)
            assert validation_result.is_valid, f"Validation failed for assessment: {validation_result}"
        
        # Validate documentations
        for documentation in test_data['documentations']:
            validation_result = validate_data_pipeline(documentation)
            assert validation_result.is_valid, f"Validation failed for documentation: {validation_result}"

    def test_database_import_and_retrieval(self):
        """
        Test database import and data retrieval workflow
        """
        # Import test data
        self.db_importer.import_test_data(self.test_data_path)
        
        # Verify import counts
        session = self.db_importer.Session()
        
        try:
            # Check assessment import
            assessments_count = session.query(Assessment).count()
            assert assessments_count == 20, f"Expected 20 assessments, got {assessments_count}"
            
            # Check documentation import
            documentations_count = session.query(Documentation).count()
            assert documentations_count == 20, f"Expected 20 documentations, got {documentations_count}"
            
            # Check analysis import
            analyses_count = session.query(Analysis).count()
            assert analyses_count == 20, f"Expected 20 analyses, got {analyses_count}"
            
            # Check report import
            reports_count = session.query(Report).count()
            assert reports_count == 20, f"Expected 20 reports, got {reports_count}"
        
        finally:
            session.close()

    def test_error_handling_integration(self):
        """
        Test integration of error handling across system components
        """
        # Simulate various error scenarios
        test_scenarios = [
            {
                'category': ErrorCategory.VALIDATION_ERROR,
                'message': 'Invalid patient data',
                'details': {'invalid_field': 'age'},
                'severity': 6
            },
            {
                'category': ErrorCategory.STATE_TRANSITION_ERROR,
                'message': 'Invalid assessment state transition',
                'details': {
                    'current_state': 'DRAFT', 
                    'target_state': 'COMPLETED'
                },
                'severity': 7
            }
        ]
        
        # Log errors and test recovery
        for scenario in test_scenarios:
            error_event = self.error_handler.log_error(
                scenario['message'],
                category=scenario['category'],
                details=scenario['details'],
                severity=scenario['severity']
            )
            
            # Attempt recovery
            recovery_result = self.error_handler.recover_from_error(error_event.id)
            assert recovery_result is not None, f"Recovery failed for error: {error_event.id}"
        
        # Verify error summary generation
        error_summary = self.error_handler.get_error_summary()
        assert error_summary['total_errors'] == len(test_scenarios), "Incorrect number of errors logged"

    def test_data_pipeline_end_to_end(self):
        """
        Comprehensive end-to-end data pipeline test
        """
        # Load test data
        with open(self.test_data_path, 'r') as f:
            test_data = json.load(f)
        
        # Track processed data
        processed_assessments = []
        processed_documentations = []
        
        # Simulate data processing workflow
        for assessment in test_data['assessments']:
            # Validate assessment
            validation_result = validate_data_pipeline(assessment)
            assert validation_result.is_valid, f"Validation failed for assessment: {assessment['id']}"
            
            # Simulate processing steps
            try:
                # Mock processing steps (replace with actual processing logic)
                processed_assessment = {
                    'id': assessment['id'],
                    'status': 'PROCESSED',
                    'processed_at': datetime.now().isoformat()
                }
                processed_assessments.append(processed_assessment)
                
            except Exception as e:
                # Log processing error
                error_event = self.error_handler.log_error(
                    f"Assessment processing failed: {assessment['id']}",
                    category=ErrorCategory.DATA_PROCESSING_ERROR,
                    details={'assessment_id': assessment['id']},
                    exception=e,
                    severity=8
                )
        
        # Perform additional validations
        assert len(processed_assessments) == 20, "Not all assessments were processed"
        
        # Optional: Add more specific checks based on your processing logic

def main():
    """
    Run integration test suite
    """
    test_suite = IntegrationTestSuite()
    
    # Run tests
    test_suite.test_data_generation_and_validation()
    test_suite.test_database_import_and_retrieval()
    test_suite.test_error_handling_integration()
    test_suite.test_data_pipeline_end_to_end()
    
    print("Integration tests completed successfully!")

if __name__ == "__main__":
    main()
