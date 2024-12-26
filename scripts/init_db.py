from sqlalchemy import create_engine, text
import json
import sys
import os
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).parent.parent
sys.path.append(str(project_root))

from database.sync_db import Base, engine
from database.models import Assessment, Client, AssessmentType, AssessmentResult

def init_db():
    # Create all tables
    Base.metadata.create_all(bind=engine)

def load_test_data():
    # Read test data
    with open('/app/tests/test_data_batch.json', 'r') as f:
        test_data = json.load(f)
    
    # Create database connection - using the container's database host
    engine = create_engine("postgresql://delilah:delilah123@delilah-db:5432/delilah_db")
    
    # Create tables if they don't exist
    Base.metadata.create_all(engine)
    
    # Insert test data
    with engine.connect() as conn:
        for assessment in test_data['assessments']:
            # Insert client
            client = {
                'first_name': assessment['patient_info']['name'].split()[0],
                'last_name': ' '.join(assessment['patient_info']['name'].split()[1:]),
                'medical_history': assessment['patient_info']['medical_history'],
                'date_of_birth': '2000-01-01',  # Default date since it's required
                'created_at': '2024-12-22T00:00:00',
                'updated_at': '2024-12-22T00:00:00'
            }
            result = conn.execute(Client.__table__.insert().values(client))
            client_id = result.inserted_primary_key[0]
            
            # Create a default user for assessor_id foreign key requirement
            user_check = conn.execute(
                text("SELECT id FROM users WHERE email = 'default@example.com'")
            ).first()
            
            if user_check is None:
                result = conn.execute(text("""
                    INSERT INTO users (email, hashed_password, is_active, is_superuser, created_at, updated_at)
                    VALUES ('default@example.com', 'hashed_password', true, false, now(), now())
                    RETURNING id
                """))
                assessor_id = result.first()[0]
            else:
                assessor_id = user_check[0]
            
            # Insert assessment type if not exists
            result = conn.execute(text("""
                INSERT INTO assessment_types (name, description, template, created_at, updated_at)
                VALUES (:name, :description, :template, now(), now())
                ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
                RETURNING id
            """), {
                'name': assessment['assessment_type'],
                'description': '',
                'template': '{}'
            })
            
            assessment_type_id = result.first()[0]
            
            # Insert assessment
            assessment_data = {
                'client_id': client_id,
                'assessor_id': assessor_id,
                'assessment_type_id': assessment_type_id,
                'status': assessment['status'],
                'created_at': '2024-12-22T00:00:00',
                'updated_at': '2024-12-22T00:00:00'
            }
            result = conn.execute(Assessment.__table__.insert().values(assessment_data))
            assessment_id = result.inserted_primary_key[0]
            
            # Insert assessment result
            result_data = {
                'assessment_id': assessment_id,
                'data': assessment['assessment_details'],
                'score': assessment['evaluation_scores'],
                'created_at': '2024-12-22T00:00:00',
                'updated_at': '2024-12-22T00:00:00'
            }
            conn.execute(AssessmentResult.__table__.insert().values(result_data))
        
        conn.commit()

if __name__ == "__main__":
    init_db()
    load_test_data()
    print("Database initialized and test data loaded successfully!")