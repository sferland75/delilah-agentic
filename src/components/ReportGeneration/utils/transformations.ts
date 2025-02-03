import * as formatters from './formatters';

export interface TransformedSymptom {
  location: string;
  painType: string;
  severity: string;
  frequency: string;
  impact: string;
  management: string;
}

export interface TransformedADL {
  task: string;
  independence: string;
  limitations: string[];
  adaptations: string[];
}

export const transformSymptoms = (symptoms: any): TransformedSymptom[] => {
  const physical = symptoms.physical.map((symptom: any) => ({
    location: symptom.location,
    painType: formatters.formatPainType(symptom.painType),
    severity: formatters.formatSeverity(symptom.severity),
    frequency: formatters.formatFrequency(symptom.frequency),
    impact: symptom.aggravating,
    management: symptom.relieving
  }));

  const cognitive = symptoms.cognitive.map((symptom: any) => ({
    location: 'Cognitive - ' + symptom.symptom,
    painType: 'N/A',
    severity: formatters.formatSeverity(symptom.severity),
    frequency: formatters.formatFrequency(symptom.frequency),
    impact: symptom.impact,
    management: symptom.management || 'Not specified'
  }));

  return [...physical, ...cognitive];
};

export const transformADLs = (adl: any): TransformedADL[] => {
  const transformedADLs: TransformedADL[] = [];

  // Basic ADLs
  Object.entries(adl.basic || {}).forEach(([category, tasks]: [string, any]) => {
    Object.entries(tasks || {}).forEach(([task, details]: [string, any]) => {
      transformedADLs.push({
        task: formatters.capitalizeWords(task),
        independence: formatters.formatIndependenceLevel(details.independence || 'not_specified'),
        limitations: details.notes ? [details.notes] : [],
        adaptations: []
      });
    });
  });

  // IADLs
  Object.entries(adl.iadl || {}).forEach(([category, tasks]: [string, any]) => {
    Object.entries(tasks || {}).forEach(([task, details]: [string, any]) => {
      transformedADLs.push({
        task: formatters.capitalizeWords(task),
        independence: formatters.formatIndependenceLevel(details.independence || 'not_specified'),
        limitations: details.notes ? [details.notes] : [],
        adaptations: []
      });
    });
  });

  return transformedADLs;
};

export const transformROM = (measurements: any[]): Record<string, any> => {
  const transformed: Record<string, any> = {};
  
  measurements.forEach(measurement => {
    const joint = measurement.joint;
    if (!transformed[joint]) {
      transformed[joint] = [];
    }

    transformed[joint].push({
      movement: measurement.movement,
      normal: formatters.formatROM(measurement.normalROM),
      left: {
        active: formatters.formatROM(measurement.left?.active || ''),
        passive: formatters.formatROM(measurement.left?.passive || ''),
        pain: measurement.painLeft || false
      },
      right: {
        active: formatters.formatROM(measurement.right?.active || ''),
        passive: formatters.formatROM(measurement.right?.passive || ''),
        pain: measurement.painRight || false
      },
      notes: measurement.notes
    });
  });

  return transformed;
};

export const transformAMAScores = (scores: any): Record<string, string> => {
  const transformed: Record<string, string> = {};
  
  Object.entries(scores || {}).forEach(([category, details]: [string, any]) => {
    Object.entries(details || {}).forEach(([subcategory, score]: [string, any]) => {
      transformed[`${category}_${subcategory}`] = formatters.formatAMAScore(score as number);
    });
  });

  return transformed;
};

export const extractKeyFindings = (data: any): string[] => {
  const findings: string[] = [];

  // Extract significant ROM limitations
  if (data.functionalAssessment?.rangeOfMotion?.measurements) {
    const romData = transformROM(data.functionalAssessment.rangeOfMotion.measurements);
    Object.entries(romData).forEach(([joint, measurements]: [string, any[]]) => {
      measurements.forEach(m => {
        if (m.notes && !m.notes.includes('No identified limitations')) {
          findings.push(`${joint} ${m.movement}: ${m.notes}`);
        }
      });
    });
  }

  // Extract severe symptoms
  if (data.symptoms?.physical) {
    data.symptoms.physical
      .filter((s: any) => s.severity === 'severe' || s.severity === 'very_severe')
      .forEach((s: any) => {
        findings.push(`${s.location}: ${formatters.formatSeverity(s.severity)} ${s.painType} pain, ${s.frequency}`);
      });
  }

  // Extract significant ADL impacts
  if (data.adl?.basic) {
    const adls = transformADLs(data.adl);
    adls
      .filter(a => a.independence === 'maximal_assistance' || a.independence === 'total_assistance')
      .forEach(a => {
        findings.push(`${a.task}: ${a.independence} - ${a.limitations.join('. ')}`);
      });
  }

  return findings;
};
