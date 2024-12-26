import json
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, JSON, DateTime, Float, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Assessment(Base):
    __tablename__ = 'assessments'
    
    id = Column(String, primary_key=True)
    assessment_type = Column(String)
    patient_info = Column(JSON)
    assessment_details = Column(JSON)
    evaluation_scores = Column(JSON)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    documentations = relationship("Documentation", back_populates="assessment")
    analyses = relationship("Analysis", back_populates="assessment")
    reports = relationship("Report", back_populates="assessment")

class Documentation(Base):
    __tablename__ = 'documentations'
    
    id = Column(String, primary_key=True)
    assessment_id = Column(String, ForeignKey('assessments.id'))
    document_type = Column(String)
    created_at = Column(DateTime)
    last_updated = Column(DateTime)
    content = Column(JSON)
    status = Column(String)
    
    # Relationship
    assessment = relationship("Assessment", back_populates="documentations")

class Analysis(Base):
    __tablename__ = 'analyses'
    
    id = Column(String, primary_key=True)
    assessment_id = Column(String, ForeignKey('assessments.id'))
    analysis_type = Column(String)
    analysis_date = Column(DateTime)
    scoring_metrics = Column(JSON)
    detailed_recommendations = Column(JSON)
    status = Column(String)
    
    # Relationship
    assessment = relationship("Assessment", back_populates="analyses")
    reports = relationship("Report", back_populates="analysis")

class Report(Base):
    __tablename__ = 'reports'
    
    id = Column(String, primary_key=True)
    assessment_id = Column(String, ForeignKey('assessments.id'))
    analysis_id = Column(String, ForeignKey('analyses.id'))
    report_type = Column(String)
    generated_at = Column(DateTime)
    patient_summary = Column(String)
    intervention_plan = Column(JSON)
    status = Column(String)
    
    # Relationships
    assessment = relationship("Assessment", back_populates="reports")
    analysis = relationship("Analysis", back_populates="reports")

class DatabaseImporter:
    def __init__(self, database_url='sqlite:///delilah_agentic.db'):
        """
        Initialize database connection and session
        """
        self.engine = create_engine(database_url)
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)

    def import_test_data(self, json_file_path):
        """
        Import test data into the database
        """
        # Start a session
        session = self.Session()

        try:
            # Load JSON data
            with open(json_file_path, 'r') as f:
                test_data = json.load(f)

            # Import Assessments
            for assessment_data in test_data['assessments']:
                assessment = Assessment(
                    id=assessment_data['id'],
                    assessment_type=assessment_data['assessment_type'],
                    patient_info=assessment_data['patient_info'],
                    assessment_details=assessment_data['assessment_details'],
                    evaluation_scores=assessment_data['evaluation_scores'],
                    status=assessment_data['status']
                )
                session.add(assessment)

            # Import Documentations
            for doc_data in test_data['documentations']:
                doc = Documentation(
                    id=doc_data['id'],
                    assessment_id=doc_data['assessment_id'],
                    document_type=doc_data['document_type'],
                    created_at=datetime.fromisoformat(doc_data['created_at']),
                    last_updated=datetime.fromisoformat(doc_data['last_updated']),
                    content=doc_data['content'],
                    status=doc_data['status']
                )
                session.add(doc)

            # Import Analyses
            for analysis_data in test_data['analyses']:
                analysis = Analysis(
                    id=analysis_data['id'],
                    assessment_id=analysis_data['assessment_id'],
                    analysis_type=analysis_data['analysis_type'],
                    analysis_date=datetime.fromisoformat(analysis_data['analysis_date']),
                    scoring_metrics=analysis_data['scoring_metrics'],
                    detailed_recommendations=analysis_data['detailed_recommendations'],
                    status=analysis_data['status']
                )
                session.add(analysis)

            # Import Reports
            for report_data in test_data['reports']:
                report = Report(
                    id=report_data['id'],
                    assessment_id=report_data['assessment_id'],
                    analysis_id=report_data['analysis_id'],
                    report_type=report_data['report_type'],
                    generated_at=datetime.fromisoformat(report_data['generated_at']),
                    patient_summary=report_data['patient_summary'],
                    intervention_plan=report_data['intervention_plan'],
                    status=report_data['status']
                )
                session.add(report)

            # Commit the transaction
            session.commit()
            print("Successfully imported test data into the database")

        except Exception as e:
            # Rollback in case of error
            session.rollback()
            print(f"Error importing test data: {e}")
            raise

        finally:
            # Close the session
            session.close()

    def query_data_summary(self):
        """
        Provide a summary of imported data
        """
        session = self.Session()
        try:
            assessments_count = session.query(Assessment).count()
            documentations_count = session.query(Documentation).count()
            analyses_count = session.query(Analysis).count()
            reports_count = session.query(Report).count()

            print(f"Database Summary:")
            print(f"Assessments: {assessments_count}")
            print(f"Documentations: {documentations_count}")
            print(f"Analyses: {analyses_count}")
            print(f"Reports: {reports_count}")

        finally:
            session.close()

def main():
    importer = DatabaseImporter()
    importer.import_test_data(r'D:\delilah-agentic\tests\test_data_batch.json')
    importer.query_data_summary()

if __name__ == "__main__":
    main()
