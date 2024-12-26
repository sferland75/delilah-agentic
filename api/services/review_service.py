from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from ..models.assessment_review import AssessmentReview, ReviewStatus

class ReviewService:
    def __init__(self, db: Session):
        self.db = db

    def create_review(self, assessment_id: UUID, reviewer_id: UUID, data: dict) -> AssessmentReview:
        review = AssessmentReview(
            assessment_id=assessment_id,
            reviewer_id=reviewer_id,
            status=ReviewStatus.IN_PROGRESS,
            review_notes=data.get("review_notes", {}),
            score_adjustments=data.get("score_adjustments", {}),
            recommendations=data.get("recommendations", [])
        )
        self.db.add(review)
        self.db.commit()
        self.db.refresh(review)
        return review

    def get_review(self, review_id: UUID) -> Optional[AssessmentReview]:
        return self.db.query(AssessmentReview).filter(
            AssessmentReview.id == review_id
        ).first()

    def get_reviews_by_assessment(self, assessment_id: UUID) -> List[AssessmentReview]:
        return self.db.query(AssessmentReview).filter(
            AssessmentReview.assessment_id == assessment_id
        ).all()

    def update_review(self, review_id: UUID, data: dict) -> AssessmentReview:
        review = self.get_review(review_id)
        if not review:
            raise ValueError("Review not found")

        for key, value in data.items():
            if hasattr(review, key):
                setattr(review, key, value)

        self.db.commit()
        self.db.refresh(review)
        return review

    def complete_review(self, review_id: UUID) -> AssessmentReview:
        review = self.get_review(review_id)
        if not review:
            raise ValueError("Review not found")

        review.status = ReviewStatus.COMPLETED
        self.db.commit()
        self.db.refresh(review)
        return review

    def reject_review(self, review_id: UUID, reason: str) -> AssessmentReview:
        review = self.get_review(review_id)
        if not review:
            raise ValueError("Review not found")

        review.status = ReviewStatus.REJECTED
        review.review_notes = {
            **(review.review_notes or {}),
            "rejection_reason": reason
        }
        self.db.commit()
        self.db.refresh(review)
        return review