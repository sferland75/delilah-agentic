from datetime import datetime, timedelta, timezone
from typing import List, Optional
import uuid
import random
from faker import Faker
from database.models import (
    Client, Therapist, Assessment, Documentation, Report,
    AssessmentStatus, DocumentationType, Agent
)
from api.models.state import AgentStateManager, AgentState, AgentCapability
from datetime_utils import strip_timezone

fake = Faker()

# Custom list of universities
UNIVERSITIES = [
    "University of Michigan",
    "Boston University",
    "New York University",
    "University of California, Los Angeles",
    "University of Texas",
    "Northwestern University",
    "University of Washington",
    "Columbia University",
    "Rush University",
    "Thomas Jefferson University"
]

class TestDataGenerator:
    def __init__(self):
        self.fake = fake
        self.fake.seed_instance(12345)  # For reproducible data
        
    def generate_contact_info(self) -> dict:
        return {
            "email": self.fake.email(),
            "phone": self.fake.phone_number(),
            "address": {
                "street": self.fake.street_address(),
                "city": self.fake.city(),
                "state": self.fake.state(),
                "zip_code": self.fake.zipcode()
            }
        }
    
    def generate_medical_history(self) -> dict:
        conditions = ["Hypertension", "Diabetes", "Arthritis", "Depression", "Anxiety"]
        medications = ["Lisinopril", "Metformin", "Ibuprofen", "Sertraline", "Alprazolam"]
        
        return {
            "conditions": random.sample(conditions, random.randint(0, 3)),
            "medications": random.sample(medications, random.randint(0, 3)),
            "allergies": random.sample(["Penicillin", "Latex", "Pollen"], random.randint(0, 2)),
            "surgeries": [
                {
                    "procedure": self.fake.word(),
                    "date": strip_timezone(self.fake.date_time_between(start_date="-10y")).isoformat()
                } for _ in range(random.randint(0, 2))
            ]
        }
    
    def generate_client(self) -> Client:
        dob = self.fake.date_time_between(start_date="-90y", end_date="-18y")
        return Client(
            id=uuid.uuid4(),
            first_name=self.fake.first_name(),
            last_name=self.fake.last_name(),
            date_of_birth=strip_timezone(dob),
            contact_info=self.generate_contact_info(),
            medical_history=self.generate_medical_history()
        )
    
    def generate_therapist(self) -> Therapist:
        specialties = [
            "Pediatrics", "Geriatrics", "Mental Health",
            "Physical Rehabilitation", "Hand Therapy",
            "Neurological Rehabilitation"
        ]
        
        credentials = {
            "license_number": f"OT-{self.fake.random_number(digits=6)}",
            "education": {
                "degree": random.choice(["MOT", "OTD"]),
                "institution": random.choice(UNIVERSITIES),
                "graduation_year": str(self.fake.random_int(min=1990, max=2023))
            },
            "certifications": random.sample([
                "CAPS", "CHT", "SCLV", "BCG", "SIS"
            ], random.randint(1, 3))
        }
        
        return Therapist(
            id=uuid.uuid4(),
            first_name=self.fake.first_name(),
            last_name=self.fake.last_name(),
            credentials=credentials,
            specialties=random.sample(specialties, random.randint(2, 4))
        )
    
    def generate_assessment(
        self, 
        client_id: uuid.UUID, 
        therapist_id: uuid.UUID,
        status: Optional[AssessmentStatus] = None
    ) -> Assessment:
        """Generate an assessment with required client and therapist IDs."""
        if not client_id or not therapist_id:
            raise ValueError("Both client_id and therapist_id are required")
            
        if status is None:
            status = random.choice(list(AssessmentStatus))
            
        scheduled_date = datetime.now() + timedelta(days=random.randint(-30, 30))
        completed_date = None
        if status == AssessmentStatus.COMPLETED:
            completed_date = scheduled_date + timedelta(hours=random.randint(1, 4))
            
        # Strip timezone info from dates
        scheduled_date = strip_timezone(scheduled_date)
        if completed_date:
            completed_date = strip_timezone(completed_date)
            
        assessment_types = [
            "Initial Evaluation", "Home Safety Assessment",
            "Functional Capacity Evaluation", "Cognitive Assessment",
            "ADL Assessment", "Hand Therapy Evaluation"
        ]
        
        return Assessment(
            id=uuid.uuid4(),
            client_id=client_id,
            therapist_id=therapist_id,
            assessment_type=random.choice(assessment_types),
            status=status,
            scheduled_date=scheduled_date,
            completed_date=completed_date,
            data={
                "observations": [self.fake.sentence() for _ in range(3)],
                "measurements": {
                    "range_of_motion": f"{random.randint(0, 180)}°",
                    "grip_strength": f"{random.randint(20, 100)} lbs",
                    "cognitive_score": random.randint(20, 30)
                }
            }
        )
    
    def generate_documentation(
        self,
        client_id: uuid.UUID,
        therapist_id: uuid.UUID,
        assessment_id: Optional[uuid.UUID] = None,
        doc_type: Optional[DocumentationType] = None
    ) -> Documentation:
        if not client_id or not therapist_id:
            raise ValueError("Both client_id and therapist_id are required")
            
        if doc_type is None:
            doc_type = random.choice(list(DocumentationType))
            
        return Documentation(
            id=uuid.uuid4(),
            client_id=client_id,
            therapist_id=therapist_id,
            assessment_id=assessment_id,
            doc_type=doc_type,
            content="\n".join([self.fake.paragraph() for _ in range(3)]),
            metadata={  # Changed from meta_info to metadata to match model
                "location": self.fake.city(),
                "duration_minutes": random.randint(30, 120),
                "goals_met": random.choice([True, False])
            }
        )
    
    def generate_report(self, assessment_id: uuid.UUID) -> Report:
        if not assessment_id:
            raise ValueError("assessment_id is required")
            
        return Report(
            id=uuid.uuid4(),
            assessment_id=assessment_id,
            content={
                "findings": [self.fake.sentence() for _ in range(3)],
                "assessment_results": {
                    "cognitive": random.randint(1, 5),
                    "physical": random.randint(1, 5),
                    "functional": random.randint(1, 5)
                },
                "goal_progress": {
                    "short_term": f"{random.randint(0, 100)}%",
                    "long_term": f"{random.randint(0, 100)}%"
                }
            },
            summary=self.fake.text(max_nb_chars=200),
            recommendations=[
                self.fake.sentence() for _ in range(random.randint(2, 5))
            ]
        )

    async def generate_sample_dataset(
        self,
        num_clients: int = 10,
        num_therapists: int = 5,
        assessments_per_client: int = 2
    ) -> dict:
        """Generate a complete sample dataset for testing."""
        try:
            # Generate clients and therapists first
            clients = [self.generate_client() for _ in range(num_clients)]
            therapists = [self.generate_therapist() for _ in range(num_therapists)]
            assessments = []
            documentations = []
            reports = []
            
            # For each client
            for client in clients:
                # Assign 1-2 random therapists to this client
                client_therapists = random.sample(therapists, min(2, len(therapists)))
                
                # Create assessments for this client
                for _ in range(assessments_per_client):
                    # Assign one of the client's therapists
                    assigned_therapist = random.choice(client_therapists)
                    
                    # Create assessment with proper client and therapist IDs
                    assessment = self.generate_assessment(
                        client_id=client.id,
                        therapist_id=assigned_therapist.id
                    )
                    assessments.append(assessment)
                    
                    # Generate related documentation
                    doc = self.generate_documentation(
                        client_id=client.id,
                        therapist_id=assessment.therapist_id,
                        assessment_id=assessment.id,
                        doc_type=random.choice(list(DocumentationType))
                    )
                    documentations.append(doc)
                    
                    # Generate report for completed assessments
                    if assessment.status == AssessmentStatus.COMPLETED:
                        report = self.generate_report(assessment.id)
                        reports.append(report)
            
            return {
                "clients": clients,
                "therapists": therapists,
                "assessments": assessments,
                "documentation": documentations,
                "reports": reports
            }
            
        except Exception as e:
            print(f"Error in generate_sample_dataset: {str(e)}")
            print(f"Clients generated: {len(clients)}")
            print(f"Therapists generated: {len(therapists)}")
            print(f"Current assessment count: {len(assessments)}")
            raise