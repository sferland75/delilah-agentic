from typing import Generator
from database.session import SessionLocal
from fastapi import Depends
from sqlalchemy.orm import Session

async def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        await db.close()

def get_assessment_service(db: Session = Depends(get_db)):
    from api.services.assessment import AssessmentService
    return AssessmentService(db)

def get_documentation_service(db: Session = Depends(get_db)):
    from api.services.documentation.service import DocumentationService
    return DocumentationService(db)

def get_analysis_service(db: Session = Depends(get_db)):
    from api.services.analysis.service import AnalysisService
    return AnalysisService(db)

def get_report_service(db: Session = Depends(get_db)):
    from api.services.report.service import ReportService
    return ReportService(db)