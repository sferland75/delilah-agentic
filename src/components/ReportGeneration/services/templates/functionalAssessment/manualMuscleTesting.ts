import { AssessmentData } from '../../../../../types/assessment';

// Manual Muscle Testing uses a 0-5 scale
const MMT_SCALE = {
  '0': 'No muscle contraction',
  '1': 'Trace muscle contraction',
  '2': 'Poor - movement through partial range with gravity eliminated',
  '3': 'Fair - movement through complete range against gravity',
  '4': 'Good - movement through complete range against gravity with moderate resistance',
  '5': 'Normal strength',
};

function formatMMTGrades(grades: any): string {
  let output = '';
  
  Object.entries(grades).forEach(([joint, muscles]: [string, any]) => {
    output += `\n${joint}:\n`;
    
    Object.entries(muscles).forEach(([muscle, movements]: [string, any]) => {
      output += `  ${muscle}:\n`;
      
      Object.entries(movements).forEach(([movement, sides]: [string, any]) => {
        output += `    ${movement}: `;
        
        if (sides.left || sides.right) {
          const left = sides.left ? `Left: ${sides.left}/5` : '';
          const right = sides.right ? `Right: ${sides.right}/5` : '';
          output += [left, right].filter(Boolean).join(', ');
        }
        output += '\n';
      });
    });
  });

  return output;
}

function summarizeMMTFindings(grades: any): string {
  const significantFindings = [];
  
  Object.entries(grades).forEach(([joint, muscles]: [string, any]) => {
    Object.entries(muscles).forEach(([muscle, movements]: [string, any]) => {
      Object.entries(movements).forEach(([movement, sides]: [string, any]) => {
        Object.entries(sides).forEach(([side, grade]: [string, any]) => {
          if (grade && parseInt(grade) <= 3) {
            significantFindings.push(
              `• ${joint} ${muscle} ${movement} (${side}): Grade ${grade}/5 (${MMT_SCALE[grade]})`
            );
          }
        });
      });
    });
  });

  if (significantFindings.length === 0) {
    return '\nNo significant muscle strength deficits were identified during assessment.';
  }

  return '\nSignificant Strength Deficits:\n' + significantFindings.join('\n');
}

export function generateMMTSection(data: AssessmentData): string {
  const mmt = data.assessment.functionalAssessment.manualMuscleTesting;
  
  return `
MANUAL MUSCLE TESTING

Grading Scale:
${Object.entries(MMT_SCALE).map(([grade, desc]) => `${grade}/5 - ${desc}`).join('\n')}

Muscle Strength Testing Results:${formatMMTGrades(mmt.grades)}

${summarizeMMTFindings(mmt.grades)}

${mmt.generalNotes ? '\nAdditional Notes:\n' + mmt.generalNotes : ''}`;
}