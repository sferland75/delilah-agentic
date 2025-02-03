import { ADL } from '../../../../../types/assessment';

const INDEPENDENCE_LEVELS: Record<string, string> = {
  independent: "Independent",
  modified_independent: "Modified Independent",
  supervision: "Supervision Required",
  minimal_assistance: "Minimal Assistance Required",
  moderate_assistance: "Moderate Assistance Required",
  maximal_assistance: "Maximal Assistance Required",
  total_assistance: "Total Assistance Required",
  not_assessed: "Not Assessed",
  not_applicable: "Not Applicable"
};

export const formatIndependenceLevel = (level: string | undefined): string => {
  if (!level) return "Not Assessed";
  return INDEPENDENCE_LEVELS[level] ?? level;
};

export const generateBasicADLSection = (adl: ADL): string => {
  const { basic, iadl, work } = adl;
  let content = '';

  // Basic ADL
  content += '## BASIC ACTIVITIES OF DAILY LIVING\n\n';

  // Bathing
  if (basic.bathing?.shower) {
    content += '### Bathing/Showering\n';
    content += `Independence Level: ${formatIndependenceLevel(basic.bathing.shower.independence)}\n`;
    if (basic.bathing.shower.notes) content += `Notes: ${basic.bathing.shower.notes}\n`;
  }

  // Dressing
  if (basic.dressing?.lower_body) {
    content += '### Dressing\n';
    content += `Lower Body - Independence Level: ${formatIndependenceLevel(basic.dressing.lower_body.independence)}\n`;
    if (basic.dressing.lower_body.notes) content += `Notes: ${basic.dressing.lower_body.notes}\n`;
  }

  // IADL Section
  content += '\n## INSTRUMENTAL ACTIVITIES OF DAILY LIVING\n\n';
  
  // Household Tasks
  if (iadl.household) {
    content += '### Household Tasks\n';
    if (iadl.household.cleaning) {
      content += `Cleaning - Independence Level: ${formatIndependenceLevel(iadl.household.cleaning.independence)}\n`;
      if (iadl.household.cleaning.notes) content += `Notes: ${iadl.household.cleaning.notes}\n`;
    }
  }

  // Community Activities
  if (iadl.community) {
    content += '### Community Activities\n';
    if (iadl.community.transportation) {
      content += `Transportation - Independence Level: ${formatIndependenceLevel(iadl.community.transportation.independence)}\n`;
      if (iadl.community.transportation.notes) content += `Notes: ${iadl.community.transportation.notes}\n`;
    }
    if (iadl.community.shopping) {
      content += `Shopping - Independence Level: ${formatIndependenceLevel(iadl.community.shopping.independence)}\n`;
      if (iadl.community.shopping.notes) content += `Notes: ${iadl.community.shopping.notes}\n`;
    }
  }

  // Work Status
  if (work?.status) {
    content += '\n## WORK STATUS\n';
    if (work.status.current_status?.notes) {
      content += `Current Status: ${work.status.current_status.notes}\n`;
    }
    if (work.status.barriers?.notes) {
      content += `Barriers: ${work.status.barriers.notes}\n`;
    }
  }

  return content;
};
