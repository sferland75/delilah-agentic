import { AssessmentData } from '../../../../../types/assessment';

function formatLimitations(limitations: string[]): string {
  if (!limitations || limitations.length === 0) {
    return 'No specific work limitations documented.';
  }

  return limitations.map(limitation => `• ${limitation}`).join('\n');
}

function formatAccommodations(accommodations: string[]): string {
  if (!accommodations || accommodations.length === 0) {
    return 'No workplace accommodations currently in place.';
  }

  return accommodations.map(accommodation => `• ${accommodation}`).join('\n');
}

export function generateWorkStatusSection(data: AssessmentData): string {
  const work = data.assessment.adl.work;
  
  if (!work || !work.status) {
    return `
WORK STATUS

Current work status information not available.`;
  }

  const status = work.status;
  
  return `
WORK STATUS

Current Employment Status:
${status.current_status?.notes || 'Not reported'}

Work Limitations:
${formatLimitations(status.barriers?.notes ? [status.barriers.notes] : [])}

Required Accommodations:
${formatAccommodations(status.workplace_accommodations?.notes ? [status.workplace_accommodations.notes] : [])}

Training Needs:
${status.training_needs?.notes || 'No specific training needs identified.'}

Additional Notes:
${work.status?.notes || 'No additional notes provided.'}`;
}