import json
import uuid
from typing import Dict, List, Any
import pytest
from pydantic import BaseModel, ValidationError, Field

class PatientInfoModel(BaseModel):
    patient_id: str
    name: str
    age: int
    gender: str
    medical_history: Dict[str, Any]

class AssessmentModel(BaseModel):
    id: str
    assessment_type: str
    patient_info: PatientInfoModel
    assessment_details: Dict[str, Any]
    evaluation_scores: Dict[str, Dict[str, float]]
    status: str

class DocumentationModel(BaseModel):
    id: str
    assessment_id: str
    document_type: str
    created_at: str
    last_updated: str
    content: Dict[str, Any]
    status: str

class AnalysisModel(BaseModel):
    id: str
    assessment_id: str
    analysis_type: str
    analysis_date: str
    scoring_metrics: Dict[str, Any]
    detailed_recommendations: List[str]
    status: str

class ReportModel(BaseModel):
    id: str
    assessment_id: str
    analysis_id: str
    report_type: str
    generated_at: str
    patient_summary: str
    intervention_plan: List[Dict[str, str]]
    status: str

class TestDataValidator:
    def __init__(self, test_data_path: str):
        with open(test_data_path, 'r') as f:
            self.test_data = json.load(f)

    def validate_assessments(self) -> List[AssessmentModel]:
        """
        Validate all generated assessments
        """
        validated_assessments = []
        for assessment in self.test_data['assessments']:
            try:
                validated_assessment = AssessmentModel(**assessment)
                validated_assessments.append(validated_assessment)
            except ValidationError as e:
                print(f"Validation error in assessment {assessment.get('id')}: {e}")
                raise
        return validated_assessments

    def validate_documentations(self) -> List[DocumentationModel]:
        """
        Validate all generated documentations
        """
        validated_documentations = []
        for doc in self.test_data['documentations']:
            try:
                validated_doc = DocumentationModel(**doc)
                validated_documentations.append(validated_doc)
            except ValidationError as e:
                print(f"Validation error in documentation {doc.get('id')}: {e}")
                raise
        return validated_documentations

    def validate_analyses(self) -> List[AnalysisModel]:
        """
        Validate all generated analyses
        """
        validated_analyses = []
        for analysis in self.test_data['analyses']:
            try:
                validated_analysis = AnalysisModel(**analysis)
                validated_analyses.append(validated_analysis)
            except ValidationError as e:
                print(f"Validation error in analysis {analysis.get('id')}: {e}")
                raise
        return validated_analyses

    def validate_reports(self) -> List[ReportModel]:
        """
        Validate all generated reports
        """
        validated_reports = []
        for report in self.test_data['reports']:
            try:
                validated_report = ReportModel(**report)
                validated_reports.append(validated_report)
            except ValidationError as e:
                print(f"Validation error in report {report.get('id')}: {e}")
                raise
        return validated_reports

    def validate_relationships(self):
        """
        Validate relationships between different components
        """
        assessment_ids = {a['id'] for a in self.test_data['assessments']}
        
        # Validate documentations
        for doc in self.test_data['documentations']:
            assert doc['assessment_id'] in assessment_ids, \
                f"Documentation {doc['id']} references non-existent assessment"

        # Validate analyses
        for analysis in self.test_data['analyses']:
            assert analysis['assessment_id'] in assessment_ids, \
                f"Analysis {analysis['id']} references non-existent assessment"

        # Validate reports
        for report in self.test_data['reports']:
            assert report['assessment_id'] in assessment_ids, \
                f"Report {report['id']} references non-existent assessment"
            
            # Ensure analysis exists for the report
            analysis_ids = {a['id'] for a in self.test_data['analyses']}
            assert report['analysis_id'] in analysis_ids, \
                f"Report {report['id']} references non-existent analysis"

def test_generate_and_validate_test_data():
    """
    Comprehensive test to validate generated test data
    """
    validator = TestDataValidator(r'D:\delilah-agentic\tests\test_data_batch.json')
    
    # Run full validation
    validated_assessments = validator.validate_assessments()
    validated_documentations = validator.validate_documentations()
    validated_analyses = validator.validate_analyses()
    validated_reports = validator.validate_reports()
    
    # Check relationship validation
    validator.validate_relationships()
    
    # Additional assertions
    assert len(validated_assessments) == 20, "Should generate 20 assessments"
    assert len(validated_documentations) == 20, "Should generate 20 documentations"
    assert len(validated_analyses) == 20, "Should generate 20 analyses"
    assert len(validated_reports) == 20, "Should generate 20 reports"

def test_data_coverage():
    """
    Test the coverage of different assessment and documentation types
    """
    validator = TestDataValidator(r'D:\delilah-agentic\tests\test_data_batch.json')
    
    # Assessment type coverage
    assessment_types = {a['assessment_type'] for a in validator.test_data['assessments']}
    expected_types = {
        "Motor Skills Evaluation", 
        "Cognitive Function Assessment", 
        "Daily Living Activities Screening", 
        "Sensory Processing Assessment", 
        "Neurological Function Test"
    }
    assert assessment_types == expected_types, "Should cover all expected assessment types"
    
    # Document type coverage
    doc_types = {d['document_type'] for d in validator.test_data['documentations']}
    expected_doc_types = {
        "Initial Assessment", 
        "Progress Report", 
        "Comprehensive Evaluation"
    }
    assert doc_types == expected_doc_types, "Should cover all expected document types"

def test_data_quality():
    """
    Test the quality of generated data
    """
    validator = TestDataValidator(r'D:\delilah-agentic\tests\test_data_batch.json')
    
    # Test age distribution
    ages = [a['patient_info']['age'] for a in validator.test_data['assessments']]
    assert min(ages) >= 18, "Minimum age should be 18"
    assert max(ages) <= 85, "Maximum age should be 85"
    
    # Test gender distribution
    genders = [a['patient_info']['gender'] for a in validator.test_data['assessments']]
    valid_genders = {"Male", "Female", "Other"}
    assert all(gender in valid_genders for gender in genders), "Invalid gender found"
    
    # Test unique IDs
    assessment_ids = [a['id'] for a in validator.test_data['assessments']]
    assert len(assessment_ids) == len(set(assessment_ids)), "Assessment IDs must be unique"
    
    # Test scoring metrics
    for analysis in validator.test_data['analyses']:
        metrics = analysis['scoring_metrics']
        assert 0 <= metrics['functional_independence'] <= 100, "Functional independence out of range"
        assert 0 <= metrics['rehabilitation_potential'] <= 100, "Rehabilitation potential out of range"
        assert metrics['intervention_priority'] in ["Low", "Medium", "High"], "Invalid intervention priority"

if __name__ == "__main__":
    pytest.main([__file__])
