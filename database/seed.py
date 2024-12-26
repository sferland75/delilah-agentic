import sys
import os
import json
from datetime import datetime
from . import Base, engine, SessionLocal
from .models import (
    User, Agent, Task, Client, AssessmentType, 
    Assessment, AssessmentResult
)

def load_test_data():
    """Load test data from JSON file"""
    with open('/app/tests/test_data_batch.json', 'r') as f:
        return json.load(f)

def seed_database():
    """Seed the database with test data"""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create a new session
    session = SessionLocal()

    try:
        print("Loading test data...")
        data = load_test_data()

        print("Creating test user...")
        test_user = User(
            email='test@example.com',
            hashed_password='test123',  # In production, this should be properly hashed
            is_active=True,
            is_superuser=False
        )
        session.add(test_user)
        
        print("Creating test agent...")
        test_agent = Agent(
            name='assessment_agent',
            description='Handles OT assessments',
            status='active'
        )
        session.add(test_agent)

        print("Creating assessment types...")
        assessment_types = set(a['assessment_type'] for a in data['assessments'])
        for type_name in assessment_types:
            assessment_type = AssessmentType(
                name=type_name,
                description=f'Standard {type_name}',
                template={
                    'sections': [
                        'patient_info',
                        'assessment_details',
                        'evaluation_scores'
                    ]
                }
            )
            session.add(assessment_type)

        # Commit initial data to get IDs
        session.commit()
        print("Initial data committed.")

        print("Creating clients and assessments...")
        for assessment_data in data['assessments']:
            # Create client
            patient_info = assessment_data['patient_info']
            client = Client(
                first_name=patient_info['name'].split()[0],
                last_name=patient_info['name'].split()[1],
                date_of_birth=datetime.now(),  # Mock date
                email=f"{patient_info['name'].replace(' ', '.').lower()}@example.com",
                medical_history=patient_info['medical_history']
            )
            session.add(client)
            session.commit()

            # Get assessment type
            assessment_type = session.query(AssessmentType).filter_by(
                name=assessment_data['assessment_type']
            ).first()

            # Create assessment
            assessment = Assessment(
                client_id=client.id,
                assessor_id=test_user.id,
                assessment_type_id=assessment_type.id,
                status=assessment_data['status'],
                scheduled_date=datetime.now(),
                notes=str(assessment_data['assessment_details'].get('initial_observations', {}))
            )
            session.add(assessment)
            session.commit()

            # Create assessment result
            result = AssessmentResult(
                assessment_id=assessment.id,
                data=assessment_data['assessment_details'],
                score=assessment_data['evaluation_scores'],
                agent_analysis=next(
                    (a for a in data['analyses'] if a['assessment_id'] == assessment_data['id']),
                    {}
                )
            )
            session.add(result)

        # Final commit
        session.commit()
        print("Database seeded successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        session.rollback()
        raise
    finally:
        session.close()

if __name__ == "__main__":
    seed_database()