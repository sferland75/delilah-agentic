import uuid
import random
from datetime import datetime, timedelta
import json
import faker

class TestDataGenerator:
    def __init__(self):
        self.fake = faker.Faker()

    def generate_assessment_data(self):
        """
        Generate mock assessment data for Occupational Therapy testing.
        Covers various assessment scenarios with realistic details.
        """
        assessment_types = [
            "Motor Skills Evaluation",
            "Cognitive Function Assessment",
            "Daily Living Activities Screening",
            "Sensory Processing Assessment",
            "Neurological Function Test"
        ]

        return {
            "id": str(uuid.uuid4()),
            "assessment_type": random.choice(assessment_types),
            "patient_info": {
                "patient_id": self.fake.uuid4(),
                "name": self.fake.name(),
                "age": random.randint(18, 85),
                "gender": random.choice(["Male", "Female", "Other"]),
                "medical_history": self.generate_medical_history()
            },
            "assessment_details": {
                "date": datetime.now().isoformat(),
                "location": self.fake.address(),
                "evaluator": self.fake.name(),
                "initial_observations": self.generate_initial_observations()
            },
            "evaluation_scores": self.generate_evaluation_scores(),
            "status": random.choice(["draft", "in_progress", "completed", "reviewed"])
        }

    def generate_medical_history(self):
        """Generate a mock medical history."""
        conditions = [
            "Stroke", "Traumatic Brain Injury", "Arthritis", 
            "Parkinson's Disease", "Multiple Sclerosis", 
            "Developmental Delay", "Spinal Cord Injury"
        ]
        
        return {
            "primary_conditions": random.sample(conditions, random.randint(0, 3)),
            "previous_treatments": [self.fake.bs() for _ in range(random.randint(1, 3))],
            "allergies": random.sample(["Latex", "Penicillin", "None"], random.randint(0, 2))
        }

    def generate_initial_observations(self):
        """Generate initial clinical observations."""
        observation_types = [
            "Motor Control", "Cognitive Function", 
            "Sensory Processing", "Communication Skills"
        ]
        
        return {
            observation: {
                "notes": self.fake.sentence(),
                "severity": random.choice(["Mild", "Moderate", "Severe"]),
                "initial_assessment": round(random.uniform(0, 10), 2)
            } for observation in random.sample(observation_types, random.randint(1, 4))
        }

    def generate_evaluation_scores(self):
        """Generate standardized evaluation scores."""
        domains = [
            "Fine Motor Skills", 
            "Gross Motor Skills", 
            "Cognitive Processing", 
            "Sensory Integration", 
            "Activity of Daily Living (ADL)"
        ]
        
        return {
            domain: {
                "raw_score": round(random.uniform(0, 100), 2),
                "percentile": round(random.uniform(0, 100), 2),
                "interpretation": random.choice([
                    "Below Average", "Average", "Above Average", "Superior"
                ])
            } for domain in domains
        }

    def generate_documentation_data(self, assessment_id=None):
        """
        Generate mock documentation data linked to an assessment.
        """
        if assessment_id is None:
            assessment_id = str(uuid.uuid4())
        
        return {
            "id": str(uuid.uuid4()),
            "assessment_id": assessment_id,
            "document_type": random.choice([
                "Initial Assessment", 
                "Progress Report", 
                "Comprehensive Evaluation"
            ]),
            "created_at": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat(),
            "content": {
                "summary": self.fake.paragraph(),
                "key_findings": [self.fake.sentence() for _ in range(3)],
                "recommendations": [self.fake.sentence() for _ in range(2)]
            },
            "status": random.choice(["draft", "in_review", "finalized"])
        }

    def generate_analysis_data(self, assessment_id=None):
        """
        Generate mock analysis data for an assessment.
        """
        if assessment_id is None:
            assessment_id = str(uuid.uuid4())
        
        return {
            "id": str(uuid.uuid4()),
            "assessment_id": assessment_id,
            "analysis_type": random.choice([
                "Comprehensive", 
                "Focused", 
                "Follow-up"
            ]),
            "analysis_date": datetime.now().isoformat(),
            "scoring_metrics": {
                "functional_independence": round(random.uniform(0, 100), 2),
                "rehabilitation_potential": round(random.uniform(0, 100), 2),
                "intervention_priority": random.choice([
                    "High", "Medium", "Low"
                ])
            },
            "detailed_recommendations": [
                self.fake.sentence() for _ in range(random.randint(2, 5))
            ],
            "status": random.choice(["pending", "completed", "reviewed"])
        }

    def generate_report_data(self, assessment_id=None, analysis_id=None):
        """
        Generate mock report data.
        """
        if assessment_id is None:
            assessment_id = str(uuid.uuid4())
        if analysis_id is None:
            analysis_id = str(uuid.uuid4())
        
        return {
            "id": str(uuid.uuid4()),
            "assessment_id": assessment_id,
            "analysis_id": analysis_id,
            "report_type": random.choice([
                "Initial Evaluation", 
                "Progress Report", 
                "Discharge Summary"
            ]),
            "generated_at": datetime.now().isoformat(),
            "patient_summary": self.fake.paragraph(),
            "intervention_plan": [
                {
                    "goal": self.fake.sentence(),
                    "strategy": self.fake.sentence(),
                    "expected_outcome": self.fake.sentence()
                } for _ in range(random.randint(1, 3))
            ],
            "status": random.choice(["draft", "final", "pending_review"])
        }

    def generate_batch_data(self, num_assessments=10):
        """
        Generate a batch of interconnected assessment data.
        """
        batch_data = {
            "assessments": [],
            "documentations": [],
            "analyses": [],
            "reports": []
        }

        for _ in range(num_assessments):
            # Generate core assessment
            assessment = self.generate_assessment_data()
            batch_data["assessments"].append(assessment)

            # Generate related documentation
            doc = self.generate_documentation_data(assessment["id"])
            batch_data["documentations"].append(doc)

            # Generate analysis
            analysis = self.generate_analysis_data(assessment["id"])
            batch_data["analyses"].append(analysis)

            # Generate report
            report = self.generate_report_data(assessment["id"], analysis["id"])
            batch_data["reports"].append(report)

        return batch_data

    def save_batch_to_json(self, batch_data, filename="test_data_batch.json"):
        """
        Save generated batch data to a JSON file.
        """
        with open(f"D:\\delilah-agentic\\tests\\{filename}", "w") as f:
            json.dump(batch_data, f, indent=2)
        
        print(f"Test data batch saved to {filename}")

# Example usage
if __name__ == "__main__":
    generator = TestDataGenerator()
    batch = generator.generate_batch_data(num_assessments=20)
    generator.save_batch_to_json(batch)
