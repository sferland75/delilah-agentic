// Based on AMA Guides to the Evaluation of Permanent Impairment, 4th Edition

export interface ImpairmentRating {
  level: string;
  percentage: number;
  description: string;
}

export const ADL_IMPAIRMENT_LEVELS: ImpairmentRating[] = [
  {
    level: "None",
    percentage: 0,
    description: "No interference with activities of daily living"
  },
  {
    level: "Mild",
    percentage: 5,
    description: "Can perform all self-care and daily activities, requires some modifications but no assistance"
  },
  {
    level: "Moderate",
    percentage: 15,
    description: "Can perform most activities but requires assistance with some self-care or daily tasks"
  },
  {
    level: "Marked",
    percentage: 25,
    description: "Can perform some activities but requires regular assistance with many self-care and daily tasks"
  },
  {
    level: "Extreme",
    percentage: 35,
    description: "Unable to perform most activities, requires constant assistance with most daily tasks"
  }
];

export const SOCIAL_IMPAIRMENT_LEVELS: ImpairmentRating[] = [
  {
    level: "None",
    percentage: 0,
    description: "No impairment in social functioning"
  },
  {
    level: "Mild",
    percentage: 5,
    description: "Slight difficulties in social situations but generally functions well"
  },
  {
    level: "Moderate",
    percentage: 15,
    description: "Notable difficulties in social interaction, can maintain some relationships"
  },
  {
    level: "Marked",
    percentage: 25,
    description: "Serious impairment in social functioning, difficulty maintaining relationships"
  },
  {
    level: "Extreme",
    percentage: 35,
    description: "Unable to engage in most social interactions or maintain relationships"
  }
];

export const CONCENTRATION_IMPAIRMENT_LEVELS: ImpairmentRating[] = [
  {
    level: "None",
    percentage: 0,
    description: "No impairment in concentration, persistence, or pace"
  },
  {
    level: "Mild",
    percentage: 5,
    description: "Occasional difficulties but can generally maintain focus and complete tasks"
  },
  {
    level: "Moderate",
    percentage: 15,
    description: "Regular difficulties with concentration and task completion"
  },
  {
    level: "Marked",
    percentage: 25,
    description: "Serious difficulties maintaining concentration or completing tasks"
  },
  {
    level: "Extreme",
    percentage: 35,
    description: "Unable to concentrate or complete tasks without constant supervision"
  }
];

export const ADAPTATION_IMPAIRMENT_LEVELS: ImpairmentRating[] = [
  {
    level: "None",
    percentage: 0,
    description: "No impairment in adaptation"
  },
  {
    level: "Mild",
    percentage: 5,
    description: "Can generally adapt to changes with some difficulty"
  },
  {
    level: "Moderate",
    percentage: 15,
    description: "Notable difficulties adapting to changes or stressors"
  },
  {
    level: "Marked",
    percentage: 25,
    description: "Serious impairment in ability to adapt to changes"
  },
  {
    level: "Extreme",
    percentage: 35,
    description: "Unable to adapt to changes or manage basic stressors"
  }
];

export function determineImpairmentLevel(
  value: number, 
  category: 'ADL' | 'Social' | 'Concentration' | 'Adaptation'
): ImpairmentRating {
  const levels = {
    'ADL': ADL_IMPAIRMENT_LEVELS,
    'Social': SOCIAL_IMPAIRMENT_LEVELS,
    'Concentration': CONCENTRATION_IMPAIRMENT_LEVELS,
    'Adaptation': ADAPTATION_IMPAIRMENT_LEVELS
  }[category];

  // Find the appropriate impairment level based on the value
  if (value <= 1) return levels[0];  // None
  if (value <= 2) return levels[1];  // Mild
  if (value <= 3) return levels[2];  // Moderate
  if (value <= 4) return levels[3];  // Marked
  return levels[4];                  // Extreme
}

export function calculateOverallImpairment(ratings: ImpairmentRating[]): {
  percentage: number,
  level: string,
  description: string
} {
  const totalPercentage = ratings.reduce((sum, rating) => sum + rating.percentage, 0) / ratings.length;
  
  // Determine overall level based on average percentage
  if (totalPercentage <= 2.5) return { percentage: totalPercentage, level: "None", description: "No significant overall impairment" };
  if (totalPercentage <= 7.5) return { percentage: totalPercentage, level: "Mild", description: "Mild overall impairment" };
  if (totalPercentage <= 17.5) return { percentage: totalPercentage, level: "Moderate", description: "Moderate overall impairment" };
  if (totalPercentage <= 27.5) return { percentage: totalPercentage, level: "Marked", description: "Marked overall impairment" };
  return { percentage: totalPercentage, level: "Extreme", description: "Extreme overall impairment" };
}