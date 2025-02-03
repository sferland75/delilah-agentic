import { AssessmentData } from '../../../../../types/assessment';

function formatROMTable(measurements: any[]): string {
  if (!measurements || measurements.length === 0) {
    return 'No range of motion measurements recorded.';
  }

  let table = `
Joint Movement            | Normal ROM | Left Active | Right Active | Pain | Notes
-------------------------|------------|-------------|--------------|------|-------
`;

  measurements.forEach(measurement => {
    const painIndicator = (measurement.painLeft || measurement.painRight) ? 'Yes' : 'No';
    const leftActive = measurement.left?.active || 'N/A';
    const rightActive = measurement.right?.active || 'N/A';
    
    table += `${(measurement.joint + ' ' + measurement.movement).padEnd(23)}|` +
             `${measurement.normalROM.padEnd(12)}|` +
             `${leftActive.padEnd(13)}|` +
             `${rightActive.padEnd(14)}|` +
             `${painIndicator.padEnd(6)}|` +
             `${measurement.notes || ''}\n`;
  });

  return table;
}

function summarizeROMFindings(measurements: any[]): string {
  if (!measurements || measurements.length === 0) {
    return '';
  }

  const significantLimitations = measurements.filter(m => {
    const hasLimitation = m.notes && !m.notes.includes('No identified limitations');
    const hasPain = m.painLeft || m.painRight;
    return hasLimitation || hasPain;
  });

  if (significantLimitations.length === 0) {
    return '\nNo significant range of motion limitations were identified during assessment.';
  }

  return '\nSignificant Findings:\n' + significantLimitations.map(limitation => 
    `• ${limitation.joint} ${limitation.movement}: ${limitation.notes}${
      limitation.painLeft || limitation.painRight ? ' (Pain reported)' : ''
    }`
  ).join('\n');
}

export function generateROMSection(data: AssessmentData): string {
  const rom = data.assessment.functionalAssessment.rangeOfMotion;
  
  return `
RANGE OF MOTION ASSESSMENT

${formatROMTable(rom.measurements)}

${summarizeROMFindings(rom.measurements)}

${rom.generalNotes ? '\nAdditional Notes:\n' + rom.generalNotes : ''}`;
}