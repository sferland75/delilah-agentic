from pathlib import Path
import sys

# Add project root to Python path
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

# Test Environment Configuration
TEST_CONFIG = {
    'database': {
        'connection_string': 'sqlite:///test_database.db',
        'echo': False
    },
    'data_generation': {
        'batch_size': 20,
        'output_file': Path(__file__).parent / 'test_data_batch.json'
    },
    'logging': {
        'level': 'DEBUG',
        'file': Path(__file__).parent / 'test_logs.log'
    }
}
