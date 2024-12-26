import os
import sys
import json
import logging
from pathlib import Path

# Add project root to Python path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

# Import test configuration and data generator
from tests.test_config import TEST_CONFIG
from tests.data_generator import TestDataGenerator

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(TEST_CONFIG['logging']['file']),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

def setup_test_environment():
    """
    Prepare the test environment:
    1. Generate test data
    2. Set up test database
    3. Configure test settings
    """
    logger.info("Setting up test environment")
    
    # Generate test data
    generator = TestDataGenerator()
    batch_data = generator.generate_batch_data(
        num_assessments=TEST_CONFIG['data_generation']['batch_size']
    )
    
    # Save test data
    output_file = TEST_CONFIG['data_generation']['output_file']
    with open(output_file, 'w') as f:
        json.dump(batch_data, f, indent=2)
    
    logger.info(f"Generated {len(batch_data['assessments'])} test assessments")
    logger.info(f"Test data saved to {output_file}")
    
    return batch_data

def validate_test_data(batch_data):
    """
    Validate the generated test data
    """
    logger.info("Validating generated test data")
    
    # Validate assessments
    assert len(batch_data['assessments']) > 0, "No assessments generated"
    for assessment in batch_data['assessments']:
        assert 'id' in assessment, "Assessment missing ID"
        assert 'patient_info' in assessment, "Assessment missing patient info"
    
    # Validate documentations
    assert len(batch_data['documentations']) > 0, "No documentations generated"
    for doc in batch_data['documentations']:
        assert 'assessment_id' in doc, "Documentation missing assessment ID"
    
    # Validate analyses
    assert len(batch_data['analyses']) > 0, "No analyses generated"
    for analysis in batch_data['analyses']:
        assert 'assessment_id' in analysis, "Analysis missing assessment ID"
    
    # Validate reports
    assert len(batch_data['reports']) > 0, "No reports generated"
    for report in batch_data['reports']:
        assert 'assessment_id' in report, "Report missing assessment ID"
        assert 'analysis_id' in report, "Report missing analysis ID"
    
    logger.info("Test data validation complete")

def main():
    """
    Main test runner
    """
    try:
        # Setup test environment and generate data
        batch_data = setup_test_environment()
        
        # Validate generated data
        validate_test_data(batch_data)
        
        # TODO: Add database import logic
        # TODO: Add initial system state tests
        
        logger.info("Test preparation completed successfully")
    
    except Exception as e:
        logger.error(f"Test preparation failed: {e}", exc_info=True)
        sys.exit(1)

if __name__ == '__main__':
    main()
