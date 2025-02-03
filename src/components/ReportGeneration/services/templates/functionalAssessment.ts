import { AssessmentData } from '../../../../types/assessment';
import { formatIndependenceLevel } from './adl/basicADL';
import { ReportSection } from '../reportTemplateSystem';

export const functionalAssessmentSection: ReportSection = {
  id: 'functionalAssessment',
  title: 'FUNCTIONAL ASSESSMENT',
  order: 4,
  generate: async (data: AssessmentData): Promise<string> => {
    const { functionalAssessment } = data.assessment;
    const { rangeOfMotion, manualMuscleTesting, bergBalance, posturalTolerances, transfers } = functionalAssessment;

    let content = '# FUNCTIONAL ASSESSMENT\n\n';

    // ROM Section
    content += '## RANGE OF MOTION\n';
    if (rangeOfMotion.measurements && rangeOfMotion.measurements.length > 0) {
      content += rangeOfMotion.measurements.map(rom => (
        `${rom.joint} ${rom.movement}:\n` +
        `Left: ${rom.left?.active || 'Not tested'} (Active) / ${rom.left?.passive || 'Not tested'} (Passive)${rom.painLeft ? ' with pain' : ''}\n` +
        `Right: ${rom.right?.active || 'Not tested'} (Active) / ${rom.right?.passive || 'Not tested'} (Passive)${rom.painRight ? ' with pain' : ''}\n` +
        `${rom.notes ? `Notes: ${rom.notes}\n` : ''}`
      )).join('\n');
    } else {
      content += 'No ROM measurements recorded\n';
    }

    // MMT Section
    content += '\n## MANUAL MUSCLE TESTING\n';
    if (Object.keys(manualMuscleTesting.grades).length > 0) {
      content += Object.entries(manualMuscleTesting.grades)
        .map(([muscle, grade]) => `${muscle}: ${grade}`)
        .join('\n');
      if (manualMuscleTesting.generalNotes) {
        content += `\nNotes: ${manualMuscleTesting.generalNotes}\n`;
      }
    } else {
      content += 'No MMT grades recorded\n';
    }

    // Berg Balance Section
    content += '\n## BERG BALANCE SCALE\n';
    if (Object.keys(bergBalance.items).length > 0) {
      content += `Total Score: ${bergBalance.totalScore}\n`;
      Object.entries(bergBalance.items).forEach(([item, data]) => {
        content += `${item}: Score ${data.score}${data.notes ? ` (${data.notes})` : ''}\n`;
      });
    }

    // Postural Tolerances
    if (posturalTolerances) {
      content += '\n## POSTURAL TOLERANCES\n';
      if (posturalTolerances.standing) content += `Standing: ${posturalTolerances.standing}\n`;
      if (posturalTolerances.walking) content += `Walking: ${posturalTolerances.walking}\n`;
    }

    // Transfers
    if (transfers && Object.keys(transfers).length > 0) {
      content += '\n## TRANSFERS\n';
      Object.entries(transfers).forEach(([type, details]) => {
        content += `${type}: ${formatIndependenceLevel(details.independence)}${details.notes ? ` (${details.notes})` : ''}\n`;
      });
    }

    return content;
  }
};
