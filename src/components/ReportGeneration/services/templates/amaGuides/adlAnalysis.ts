import { AssessmentData } from '../../../../../types/assessment';
import { determineImpairmentLevel, ImpairmentRating } from './calculations';

function analyzeADLImpairments(data: AssessmentData): {
  rating: ImpairmentRating,
  evidence: string[]
} {
  const basic = data.assessment.adl.basic;
  const evidencePoints: string[] = [];
  let impairmentScore = 0;

  // Self-care activities
  if (basic.bathing?.shower) {
    const showerImpairment = basic.bathing.shower.independence !== 'independent';
    if (showerImpairment) {
      impairmentScore++;
      evidencePoints.push(`Bathing: ${basic.bathing.shower.notes}`);
    }
  }

  if (basic.dressing?.lower_body) {
    const dressingImpairment = basic.dressing.lower_body.independence !== 'independent';
    if (dressingImpairment) {
      impairmentScore++;
      evidencePoints.push(`Dressing: ${basic.dressing.lower_body.notes}`);
    }
  }

  // Transfers and mobility
  const transfers = basic.transfers;
  if (transfers) {
    const transferImpairments = Object.entries(transfers)
      .filter(([_, value]) => value.independence !== 'independent')
      .map(([key, value]) => `${key.replace('_', ' ')}: ${value.notes}`);
    
    if (transferImpairments.length > 0) {
      impairmentScore++;
      evidencePoints.push(...transferImpairments);
    }
  }

  // Feeding and medication management
  if (basic.feeding?.eating?.notes) {
    impairmentScore++;
    evidencePoints.push(`Feeding: ${basic.feeding.eating.notes}`);
  }

  // IADL impacts
  const iadl = data.assessment.adl.iadl;
  if (iadl) {
    if (iadl.household?.cleaning?.independence !== 'independent') {
      impairmentScore += 0.5;
      evidencePoints.push(`Housekeeping: ${iadl.household.cleaning.notes}`);
    }

    if (iadl.community?.transportation?.independence !== 'independent') {
      impairmentScore += 0.5;
      evidencePoints.push(`Transportation: ${iadl.community.transportation.notes}`);
    }
  }

  // Normalize score to 0-5 scale
  const normalizedScore = Math.min(impairmentScore, 5);
  
  return {
    rating: determineImpairmentLevel(normalizedScore, 'ADL'),
    evidence: evidencePoints
  };
}

export function generateADLAnalysis(data: AssessmentData): string {
  const analysis = analyzeADLImpairments(data);
  
  return `
Activities of Daily Living Impairment Analysis:

Current Impairment Level: ${analysis.rating.level} (${analysis.rating.percentage}%)
${analysis.rating.description}

Supporting Evidence:
${analysis.evidence.map(e => `• ${e}`).join('\n')}

Impact on Function:
This level of impairment indicates that the client ${
  analysis.rating.level === 'None' ? 'maintains independence in ADLs' :
  analysis.rating.level === 'Mild' ? 'requires some modifications but maintains independence' :
  analysis.rating.level === 'Moderate' ? 'requires assistance with several ADLs' :
  analysis.rating.level === 'Marked' ? 'requires significant assistance with most ADLs' :
  'is dependent for most ADLs'
}.`;
}