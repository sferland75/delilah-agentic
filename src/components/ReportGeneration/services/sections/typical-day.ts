import { AssessmentData } from '../../types';

export interface DailyRoutine {
  sleepSchedule: {
    wakeTime?: string;
    bedTime?: string;
  };
  routines: {
    morning: {
      activities?: string;
    };
    afternoon: {
      activities?: string;
    };
    evening: {
      activities?: string;
    };
    night: {
      activities?: string;
    };
  };
}

export interface TypicalDayData {
  preAccident: {
    daily: DailyRoutine;
    weekly: any;
  };
  current: {
    daily: DailyRoutine;
    weekly: any;
  };
}

export const generateTypicalDayPrompt = (data: TypicalDayData) => {
  return `Please analyze the pre-accident and current daily routines for this client and generate a professional medico-legal report section comparing them. Focus on functional changes and their impact on independence.

PRE-ACCIDENT ROUTINE:
Sleep Schedule: Wake ${data.preAccident.daily.sleepSchedule.wakeTime || 'N/A'}, Bed ${data.preAccident.daily.sleepSchedule.bedTime || 'N/A'}
Morning Activities: ${data.preAccident.daily.routines.morning.activities || 'N/A'}
Afternoon Activities: ${data.preAccident.daily.routines.afternoon.activities || 'N/A'}
Evening Activities: ${data.preAccident.daily.routines.evening.activities || 'N/A'}
Night Activities: ${data.preAccident.daily.routines.night.activities || 'N/A'}

CURRENT ROUTINE:
Sleep Schedule: Wake ${data.current.daily.sleepSchedule.wakeTime || 'N/A'}, Bed ${data.current.daily.sleepSchedule.bedTime || 'N/A'}
Morning Activities: ${data.current.daily.routines.morning.activities || 'N/A'}
Afternoon Activities: ${data.current.daily.routines.afternoon.activities || 'N/A'} 
Evening Activities: ${data.current.daily.routines.evening.activities || 'N/A'}
Night Activities: ${data.current.daily.routines.night.activities || 'N/A'}

Please generate a narrative that:
1. Clearly describes both pre-accident and current routines
2. Highlights key changes in activity level and independence
3. Notes timing of activities and rest periods
4. Discusses impact on roles and responsibilities
5. Identifies symptom patterns throughout the day
6. Notes family assistance and adaptations required
7. Documents specific functional limitations evident in the routines

Format the response as: 
1. Pre-Accident Routine paragraph
2. Current Routine paragraph 
3. Analysis of Changes and Impact paragraph

Use professional medical-legal language while maintaining clarity.`;
};

export const extractTypicalDayData = (data: AssessmentData): TypicalDayData => {
  return data.assessment.typicalDay;
};

export const validateTypicalDayData = (data: TypicalDayData): boolean => {
  // Validate current routine data exists
  if (!data.current?.daily?.routines) {
    return false;
  }

  // Require at least one time period with activities
  const hasCurrentActivities = Object.values(data.current.daily.routines)
    .some(period => period.activities?.trim());

  return hasCurrentActivities;
};

export const getTypicalDaySection = async (
  data: AssessmentData,
  narrator: any
): Promise<string> => {
  const sectionData = extractTypicalDayData(data);
  
  if (!validateTypicalDayData(sectionData)) {
    console.warn('Insufficient typical day data');
    return '';
  }

  const prompt = generateTypicalDayPrompt(sectionData);
  return await narrator.generateNarrative(prompt);
};