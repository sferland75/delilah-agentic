# scripts/populate_db.py

import asyncio
from faker import Faker
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from datetime import datetime, timedelta
import random
from typing import List
import sys
import os
from pathlib import Path

# Add project root to Python path
project_root = str(Path(__file__).parent.parent)
print(f"Project root: {project_root}")
sys.path.append(project_root)

from database.models import (
    Base, Client, Therapist, Assessment, Documentation,
    AssessmentStatus, DocumentationType, Report
)
from database.database import async_session_maker, engine

fake = Faker()

async def create_therapists(session: AsyncSession, count: int = 5) -> List[Therapist]:
    """Create therapist records"""
    therapists = []
    specialties = ['Pediatric', 'Geriatric', 'Mental Health', 'Physical Rehabilitation', 'Hand Therapy']
    certifications = ["CHT", "BCG", "CAPS", "SCLV"]
    institutions = [
        "Columbia University", "New York University", "University of Michigan",
        "Northwestern University", "Thomas Jefferson University"
    ]
    
    for _ in range(count):
        therapist = Therapist(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            credentials={
                "license_number": f"OT-{fake.random_number(digits=6)}",
                "education": {
                    "degree": random.choice(["OTD", "MOT"]),
                    "institution": random.choice(institutions),
                    "graduation_year": str(fake.random_int(min=1990, max=2023))
                },
                "certifications": random.sample(certifications, k=random.randint(1, 3))
            },
            specialties=random.sample(specialties, k=random.randint(2, 4)),
            active=True
        )
        session.add(therapist)
        therapists.append(therapist)
    
    await session.commit()
    return therapists

async def create_clients(session: AsyncSession, count: int = 10) -> List[Client]:
    """Create client records"""
    clients = []
    conditions = ['Anxiety', 'Depression', 'Hypertension', 'Diabetes', 'Arthritis']
    medications = ['Lisinopril', 'Metformin', 'Alprazolam', 'Sertraline', 'Ibuprofen']
    allergies = ['Penicillin', 'Latex', 'Pollen']
    
    for _ in range(count):
        client = Client(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            date_of_birth=fake.date_of_birth(minimum_age=5, maximum_age=90),
            contact_info={
                "email": fake.email(),
                "phone": fake.phone_number(),
                "address": {
                    "street": fake.street_address(),
                    "city": fake.city(),
                    "state": fake.state(),
                    "zip_code": fake.zipcode()
                }
            },
            medical_history={
                "conditions": random.sample(conditions, k=random.randint(0, 3)),
                "medications": random.sample(medications, k=random.randint(0, 3)),
                "allergies": random.sample(allergies, k=random.randint(0, 2)),
                "surgeries": [
                    {
                        "procedure": fake.word(),
                        "date": fake.date_time_between(start_date="-10y").isoformat()
                    } for _ in range(random.randint(0, 2))
                ]
            },
            active=True
        )
        session.add(client)
        clients.append(client)
    
    await session.commit()
    return clients

async def create_assessments(
    session: AsyncSession,
    clients: List[Client],
    therapists: List[Therapist],
    count: int = 20
) -> List[Assessment]:
    """Create assessment records"""
    assessments = []
    assessment_types = [
        'Initial Evaluation',
        'Functional Capacity Evaluation',
        'Home Safety Assessment',
        'Cognitive Assessment',
        'ADL Assessment'
    ]
    
    for _ in range(count):
        client = random.choice(clients)
        therapist = random.choice(therapists)
        status = random.choice([
            AssessmentStatus.SCHEDULED,
            AssessmentStatus.IN_PROGRESS,
            AssessmentStatus.COMPLETED,
            AssessmentStatus.CANCELLED
        ])
        
        scheduled_date = fake.date_time_between(start_date="-30d", end_date="+30d")
        
        assessment = Assessment(
            client_id=client.id,
            therapist_id=therapist.id,
            assessment_type=random.choice(assessment_types),
            status=status,
            data={
                "observations": [fake.text(max_nb_chars=100) for _ in range(3)],
                "measurements": {
                    "range_of_motion": f"{random.randint(0, 180)}°",
                    "grip_strength": f"{random.randint(20, 100)} lbs",
                    "cognitive_score": random.randint(20, 30)
                }
            },
            scheduled_date=scheduled_date,
            completed_date=scheduled_date + timedelta(hours=3) if status == AssessmentStatus.COMPLETED else None
        )
        session.add(assessment)
        assessments.append(assessment)
    
    await session.commit()
    return assessments

async def create_documentation(
    session: AsyncSession,
    assessments: List[Assessment],
    count: int = 30
) -> List[Documentation]:
    """Create documentation records"""
    documentations = []
    
    for _ in range(count):
        assessment = random.choice(assessments)
        doc_type = random.choice([
            DocumentationType.ASSESSMENT_NOTE,
            DocumentationType.PROGRESS_NOTE,
            DocumentationType.TREATMENT_PLAN,
            DocumentationType.DISCHARGE_SUMMARY
        ])
        
        documentation = Documentation(
            client_id=assessment.client_id,
            therapist_id=assessment.therapist_id,
            assessment_id=assessment.id,
            doc_type=doc_type,
            content=fake.text(max_nb_chars=500),
            meta_info={
                "version": "1.0",
                "template_used": fake.word(),
                "last_modified_by": fake.name(),
                "tags": random.sample(["initial", "follow-up", "discharge", "progress"], k=2)
            }
        )
        session.add(documentation)
        documentations.append(documentation)
    
    await session.commit()
    return documentations

async def verify_relationships(session: AsyncSession):
    """Verify that relationships are properly populated"""
    print("\nVerifying relationships...")
    
    # Query first assessment with all relationships loaded
    query = (
        select(Assessment)
        .options(
            selectinload(Assessment.client),
            selectinload(Assessment.therapist),
            selectinload(Assessment.documents)
        )
        .limit(1)
    )
    
    result = await session.execute(query)
    assessment = result.scalar_one_or_none()
    
    if assessment:
        print(f"\nAssessment {assessment.id}:")
        print(f"Type: {assessment.assessment_type}")
        print(f"Status: {assessment.status.value}")
        print(f"Client: {assessment.client.first_name} {assessment.client.last_name}")
        print(f"Therapist: {assessment.therapist.first_name} {assessment.therapist.last_name}")
        
        doc_count = len(assessment.documents)
        doc_types = [doc.doc_type.value for doc in assessment.documents]
        print(f"Documentation count: {doc_count}")
        if doc_count > 0:
            print(f"Documentation types: {doc_types}")
            
        print("\nMeasurements:")
        measurements = assessment.data.get('measurements', {})
        for key, value in measurements.items():
            print(f"  {key}: {value}")
            
        print("\nClient Details:")
        print(f"  Age: {assessment.client.date_of_birth}")
        print(f"  Contact: {assessment.client.contact_info.get('email')}")
        print(f"  Active: {assessment.client.active}")
        
        print("\nTherapist Details:")
        print(f"  Specialties: {assessment.therapist.specialties}")
        print(f"  Credentials: {assessment.therapist.credentials.get('license_number')}")
        print(f"  Active: {assessment.therapist.active}")
    else:
        print("No assessments found in database")

async def main():
    """Main execution function"""
    print("Starting database population process...")
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    async with async_session_maker() as session:
        print("\nCreating test data...")
        try:
            therapists = await create_therapists(session)
            print(f"Added {len(therapists)} therapists")
            
            clients = await create_clients(session)
            print(f"Added {len(clients)} clients")
            
            assessments = await create_assessments(session, clients, therapists)
            print(f"Added {len(assessments)} assessments")
            
            documentation = await create_documentation(session, assessments)
            print(f"Added {len(documentation)} documentation records")
            
            await verify_relationships(session)
            
        except Exception as e:
            print(f"\nError while populating data: {str(e)}")
            raise

if __name__ == "__main__":
    asyncio.run(main())