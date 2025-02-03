import { AssessmentData } from '../../../../../types/assessment';
import { determineImpairmentLevel, ImpairmentRating } from './calculations';

function analyzeSocialImpairments(data: AssessmentData): {
  rating: ImpairmentRating,
  evidence: string[]
} {
  const evidencePoints: string[] = [];
  let impairmentScore = 0;

  // Analyze emotional symptoms that impact social functioning
  if (data.assessment.symptoms?.emotional) {
    data.assessment.symptoms.emotional.forEach(symptom => {
      if (symptom.severity === 'Severe' || symptom.frequency === 'Constantly') {
        impairmentScore += 1;
        evidencePoints.push(`${symptom.symptom}: ${symptom.impact}`);
      } else if (symptom.severity === 'Moderate' || symptom.frequency === 'Often') {
        impairmentScore += 0.5;
        evidencePoints.push(`${symptom.symptom}: ${symptom.impact}`);
      }
    });
  }

  // Analyze cognitive symptoms that affect social interaction
  if (data.assessment.symptoms?.cognitive) {
    data.assessment.symptoms.cognitive.forEach(symptom => {
      if (['Language', 'Attention', 'Problem Solving'].includes(symptom.symptom)) {
        if (symptom.severity === 'Severe') {
          impairmentScore += 1;
          evidencePoints.push(`${symptom.symptom}: ${symptom.impact}`);
        } else if (symptom.severity === 'Moderate') {
          impairmentScore += 0.5;
          evidencePoints.push(`${symptom.symptom}: ${symptom.impact}`);
        }
      }
    });
  }

  // Family relationships and social interactions
  const typical = data.assessment.typicalDay?.current;
  if (typical?.daily?.routines) {
    const routines = typical.daily.routines;
    let socialIsolation = true;

    // Check for social engagement in daily routines
    ['morning', 'afternoon', 'evening'].forEach(timeOfDay => {
      if (routines[timeOfDay]?.activities?.toLowerCase().includes('family') ||
          routines[timeOfDay]?.activities?.toLowerCase().includes('friend') ||
          routines[timeOfDay]?.activities?.toLowerCase().includes('social')) {
        socialIsolation = false;
      }
    });

    if (socialIsolation) {
      impairmentScore += 1;
      evidencePoints.push('Limited social engagement in daily routine');
    }
  }

  // Work/community involvement
  if (data.assessment.adl?.work?.status?.barriers?.notes) {
    impairmentScore += 0.5;
    evidencePoints.push(`Work barriers: ${data.assessment.adl.work.status.barriers.notes}`);
  }

  // Normalize score to 0-5 scale
  const normalizedScore = Math.min(impairmentScore, 5);
  
  return {
    rating: determineImpairmentLevel(normalizedScore, 'Social'),
    evidence: evidencePoints
  };
}

export function generateSocialAnalysis(data: AssessmentData): string {
  const analysis = analyzeSocialImpairments(data);
  
  return `
Social Functioning Impairment Analysis:

Current Impairment Level: ${analysis.rating.level} (${analysis.rating.percentage}%)
${analysis.rating.description}

Supporting Evidence:
${analysis.evidence.map(e => `• ${e}`).join('\n')}

Impact on Function:
This level of impairment indicates that the client ${
  analysis.rating.level === 'None' ? 'maintains normal social functioning' :
  analysis.rating.level === 'Mild' ? 'has mild difficulties in social situations but generally functions well' :
  analysis.rating.level === 'Moderate' ? 'experiences notable difficulties in social interactions' :
  analysis.rating.level === 'Marked' ? 'has serious impairment in social functioning' :
  'is severely limited in social functioning'
}.`;
}