import { AssessmentData } from '../../../../../types/assessment';

const BERG_SCALE_INTERPRETATION = {
  rangeSummary: (score: number): string => {
    if (score >= 56) return 'Independent';
    if (score >= 41) return 'Walking with assistance';
    if (score >= 21) return 'Wheelchair with assistance';
    return 'Wheelchair bound';
  },
  riskLevel: (score: number): string => {
    if (score <= 20) return 'High fall risk';
    if (score <= 40) return 'Medium fall risk';
    return 'Low fall risk';
  }
};

const BERG_ITEMS = {
  sittingToStanding: 'Sitting to Standing',
  standingUnsupported: 'Standing Unsupported',
  sittingUnsupported: 'Sitting Unsupported',
  standingToSitting: 'Standing to Sitting',
  transfers: 'Transfers',
  standingEyesClosed: 'Standing with Eyes Closed',
  standingFeetTogether: 'Standing with Feet Together',
  reachingForward: 'Reaching Forward',
  retrieveObject: 'Retrieve Object from Floor',
  turningToLookBehind: 'Turn to Look Behind',
  turn360: 'Turn 360 Degrees',
  alternateFootOnStep: 'Placing Alternate Foot on Step',
  tandemStance: 'Standing in Tandem Position',
  standingOnOneLeg: 'Standing on One Leg'
};

function formatBergTable(items: any): string {
  let table = `
Task                                | Score | Notes
------------------------------------|-------|-------
`;

  Object.entries(BERG_ITEMS).forEach(([key, description]) => {
    if (items[key]) {
      table += `${description.padEnd(36)}|  ${items[key].score}/4  | ${items[key].notes || ''}\n`;
    }
  });

  return table;
}

function summarizeBergFindings(items: any, totalScore: number): string {
  const limitations = Object.entries(items)
    .filter(([_, data]: [string, any]) => data.score < 4)
    .map(([key, data]: [string, any]) => 
      `• ${BERG_ITEMS[key]}: Score ${data.score}/4 ${data.notes ? `- ${data.notes}` : ''}`
    );

  const interpretation = `
Overall Score: ${totalScore}/56
Functional Level: ${BERG_SCALE_INTERPRETATION.rangeSummary(totalScore)}
Fall Risk Assessment: ${BERG_SCALE_INTERPRETATION.riskLevel(totalScore)}
`;

  if (limitations.length === 0) {
    return interpretation + '\nNo significant balance limitations identified.';
  }

  return interpretation + '\nBalance Limitations:\n' + limitations.join('\n');
}

export function generateBergSection(data: AssessmentData): string {
  const berg = data.assessment.functionalAssessment.bergBalance;
  
  return `
BERG BALANCE SCALE ASSESSMENT

${formatBergTable(berg.items)}

${summarizeBergFindings(berg.items, berg.totalScore)}

${berg.generalNotes ? '\nAdditional Notes:\n' + berg.generalNotes : ''}`;
}