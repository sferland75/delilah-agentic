import { AssessmentData } from '../../../../../types/assessment';

function generateHouseholdSection(iadl: any): string {
  const sections = [];
  
  if (iadl.household?.cleaning) {
    sections.push(`Cleaning: ${formatIndependenceLevel(iadl.household.cleaning.independence)}
${iadl.household.cleaning.notes ? `  Notes: ${iadl.household.cleaning.notes}` : ''}`);
  }
  
  if (iadl.household?.laundry) {
    sections.push(`Laundry: ${formatIndependenceLevel(iadl.household.laundry.independence)}
${iadl.household.laundry.notes ? `  Notes: ${iadl.household.laundry.notes}` : ''}`);
  }
  
  if (iadl.household?.meal_prep) {
    sections.push(`Meal Preparation: ${formatIndependenceLevel(iadl.household.meal_prep.independence)}
${iadl.household.meal_prep.notes ? `  Notes: ${iadl.household.meal_prep.notes}` : ''}`);
  }
  
  if (iadl.household?.home_maintenance) {
    sections.push(`Home Maintenance: ${formatIndependenceLevel(iadl.household.home_maintenance.independence)}
${iadl.household.home_maintenance.notes ? `  Notes: ${iadl.household.home_maintenance.notes}` : ''}`);
  }

  return sections.join('\n\n');
}

function generateCommunitySection(iadl: any): string {
  const sections = [];
  
  if (iadl.community?.transportation) {
    sections.push(`Transportation: ${formatIndependenceLevel(iadl.community.transportation.independence)}
${iadl.community.transportation.notes ? `  Notes: ${iadl.community.transportation.notes}` : ''}`);
  }
  
  if (iadl.community?.shopping) {
    sections.push(`Shopping: ${formatIndependenceLevel(iadl.community.shopping.independence)}
${iadl.community.shopping.notes ? `  Notes: ${iadl.community.shopping.notes}` : ''}`);
  }
  
  if (iadl.community?.money_management) {
    sections.push(`Money Management: ${formatIndependenceLevel(iadl.community.money_management.independence)}
${iadl.community.money_management.notes ? `  Notes: ${iadl.community.money_management.notes}` : ''}`);
  }
  
  if (iadl.community?.communication) {
    sections.push(`Communication: ${formatIndependenceLevel(iadl.community.communication.independence)}
${iadl.community.communication.notes ? `  Notes: ${iadl.community.communication.notes}` : ''}`);
  }

  return sections.join('\n\n');
}

function generateHealthManagementSection(iadl: any): string {
  const sections = [];
  const health = iadl.health;

  if (health?.routine?.sleep) {
    sections.push(`Sleep: ${health.routine.sleep.notes}`);
  }
  
  if (health?.routine?.stress) {
    sections.push(`Stress Management: ${health.routine.stress.notes}`);
  }
  
  if (health?.management?.medications) {
    sections.push(`Medication Management: ${health.management.medications.notes}`);
  }
  
  if (health?.management?.exercise) {
    sections.push(`Exercise Routine: ${health.management.exercise.notes}`);
  }

  return sections.join('\n\n');
}

export function generateInstrumentalADLSection(data: AssessmentData): string {
  const iadl = data.assessment.adl.iadl;
  
  return `
INSTRUMENTAL ACTIVITIES OF DAILY LIVING

Household Management:
${generateHouseholdSection(iadl)}

Community Activities:
${generateCommunitySection(iadl)}

Health Management:
${generateHealthManagementSection(iadl)}`;
}