import { format } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'MMMM d, yyyy');
};

export const formatMeasurement = (value: number, unit: string): string => {
  return `${value}${unit}`;
};

export const formatROM = (value: string): string => {
  // Converts ROM values like "0-45°" to proper format
  if (!value) return 'Not tested';
  return value.includes('-') ? value : `0-${value}`;
};

export const formatMMTGrade = (grade: string): string => {
  const gradeMap: Record<string, string> = {
    '0': 'No contraction',
    '1': 'Trace',
    '2': 'Poor',
    '3': 'Fair',
    '4': 'Good',
    '5': 'Normal'
  };
  return gradeMap[grade] || grade;
};

export const formatAMAScore = (score: number): string => {
  const scoreMap: Record<number, string> = {
    0: 'No Impairment (0%)',
    1: 'Mild Impairment (1-25%)',
    2: 'Moderate Impairment (26-50%)',
    3: 'Severe Impairment (51-75%)',
    4: 'Complete Impairment (76-100%)'
  };
  return scoreMap[score] || `Score: ${score}`;
};

export const formatIndependenceLevel = (level: string): string => {
  const levelMap: Record<string, string> = {
    'independent': 'Independent',
    'modified_independent': 'Modified Independent',
    'supervision': 'Supervision Required',
    'minimal_assistance': 'Minimal Assistance',
    'moderate_assistance': 'Moderate Assistance',
    'maximal_assistance': 'Maximal Assistance',
    'total_assistance': 'Total Assistance',
    'not_applicable': 'Not Applicable'
  };
  return levelMap[level] || level;
};

export const capitalizeWords = (str: string): string => {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatFrequency = (value: string): string => {
  const frequencyMap: Record<string, string> = {
    'rarely': 'Rarely (1-2 times per month)',
    'sometimes': 'Sometimes (1-2 times per week)',
    'often': 'Often (3-4 times per week)',
    'most_of_the_time': 'Most of the time (5-6 times per week)',
    'constantly': 'Constantly (Daily)'
  };
  return frequencyMap[value] || value;
};

export const formatSeverity = (value: string): string => {
  const severityMap: Record<string, string> = {
    'none': 'None (0/10)',
    'mild': 'Mild (1-3/10)',
    'moderate': 'Moderate (4-6/10)',
    'severe': 'Severe (7-8/10)',
    'very_severe': 'Very Severe (9-10/10)'
  };
  return severityMap[value] || value;
};

export const formatListWithCounts = (items: string[]): string => {
  if (!items.length) return 'None reported';
  return items
    .filter(Boolean)
    .map((item, index) => `${index + 1}. ${item}`)
    .join('\n');
};

export const formatPainType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'sharp': 'Sharp/Stabbing',
    'dull': 'Dull/Aching',
    'burning': 'Burning',
    'tingling': 'Tingling/Pins and needles',
    'throbbing': 'Throbbing',
    'shooting': 'Shooting',
    'cramping': 'Cramping',
    'aching': 'Aching'
  };
  return typeMap[type] || type;
};

export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone; // Return original if not 10 digits
};

// Helper for generating consistent paragraph formats
export const formatParagraph = (text: string): string => {
  if (!text) return '';
  // Ensure single line breaks are preserved but multiple ones are reduced
  return text
    .trim()
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+/g, ' ');
};
