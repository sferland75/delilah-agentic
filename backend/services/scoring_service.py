from typing import Dict, List, Optional, Any
from pydantic import BaseModel

class ScoreRange(BaseModel):
    min: float
    max: float
    label: str
    description: Optional[str] = None

class ScoringRule(BaseModel):
    field_id: str
    weight: float = 1.0
    scoring_method: str  # 'numeric', 'scale', 'custom'
    value_map: Optional[Dict[str, float]] = None  # For mapping categorical values to scores
    custom_logic: Optional[str] = None  # For custom scoring functions

class ScoringMethod(BaseModel):
    method: str  # 'weighted_sum', 'average', 'custom'
    rules: List[ScoringRule]
    ranges: List[ScoreRange]
    custom_logic: Optional[str] = None

class ScoringResult(BaseModel):
    total_score: float
    section_scores: Dict[str, float]
    field_scores: Dict[str, float]
    score_label: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

class ScoringService:
    def __init__(self, db_session):
        self.db = db_session

    async def score_assessment(
        self,
        assessment_data: Dict[str, Any],
        template_id: str
    ) -> ScoringResult:
        """Score an assessment based on its template scoring rules"""
        template = await self._get_template(template_id)
        scoring_method = template.get('scoring', {})
        
        field_scores: Dict[str, float] = {}
        section_scores: Dict[str, float] = {}
        
        # Score individual fields
        for section in assessment_data['sections']:
            section_score = 0
            section_weights = 0
            
            for response in section['responses']:
                field_id = response['field_id']
                rule = self._get_scoring_rule(scoring_method, field_id)
                
                if rule:
                    field_score = await self._calculate_field_score(
                        response['value'],
                        rule
                    )
                    field_scores[field_id] = field_score
                    section_score += field_score * rule.weight
                    section_weights += rule.weight
            
            if section_weights > 0:
                section_scores[section['section_id']] = section_score / section_weights

        # Calculate total score based on scoring method
        total_score = await self._calculate_total_score(
            scoring_method,
            field_scores,
            section_scores
        )

        # Determine score label based on ranges
        score_label = self._get_score_label(total_score, scoring_method.get('ranges', []))

        return ScoringResult(
            total_score=total_score,
            section_scores=section_scores,
            field_scores=field_scores,
            score_label=score_label
        )

    async def _calculate_field_score(
        self,
        value: Any,
        rule: ScoringRule
    ) -> float:
        """Calculate score for a single field based on its scoring rule"""
        if rule.scoring_method == 'numeric':
            return float(value) if value is not None else 0.0
            
        elif rule.scoring_method == 'scale':
            if rule.value_map and value in rule.value_map:
                return rule.value_map[value]
            return 0.0
            
        elif rule.scoring_method == 'custom' and rule.custom_logic:
            # Here we would implement custom scoring logic
            # For now, returning 0
            return 0.0
            
        return 0.0

    async def _calculate_total_score(
        self,
        scoring_method: Dict[str, Any],
        field_scores: Dict[str, float],
        section_scores: Dict[str, float]
    ) -> float:
        """Calculate total assessment score based on scoring method"""
        method = scoring_method.get('method', 'average')
        
        if method == 'weighted_sum':
            total = 0.0
            weights = 0.0
            
            for field_id, score in field_scores.items():
                rule = self._get_scoring_rule(scoring_method, field_id)
                if rule:
                    total += score * rule.weight
                    weights += rule.weight
                    
            return total / weights if weights > 0 else 0.0
            
        elif method == 'average':
            scores = list(field_scores.values())
            return sum(scores) / len(scores) if scores else 0.0
            
        elif method == 'custom' and scoring_method.get('custom_logic'):
            # Here we would implement custom scoring logic
            # For now, returning average
            scores = list(field_scores.values())
            return sum(scores) / len(scores) if scores else 0.0
            
        return 0.0

    def _get_scoring_rule(
        self,
        scoring_method: Dict[str, Any],
        field_id: str
    ) -> Optional[ScoringRule]:
        """Get scoring rule for a specific field"""
        rules = scoring_method.get('rules', [])
        for rule in rules:
            if rule['field_id'] == field_id:
                return ScoringRule(**rule)
        return None

    def _get_score_label(
        self,
        score: float,
        ranges: List[Dict[str, Any]]
    ) -> Optional[str]:
        """Get label for a score based on defined ranges"""
        for range_data in ranges:
            if range_data['min'] <= score <= range_data['max']:
                return range_data['label']
        return None

    async def _get_template(self, template_id: str) -> Dict[str, Any]:
        """Fetch template from database"""
        # Here we would fetch from database
        # For now, returning mock data
        return {
            'scoring': {
                'method': 'weighted_sum',
                'rules': [],
                'ranges': [
                    {'min': 0, 'max': 40, 'label': 'Low'},
                    {'min': 41, 'max': 70, 'label': 'Medium'},
                    {'min': 71, 'max': 100, 'label': 'High'}
                ]
            }
        }