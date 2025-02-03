interface CareTask {
  frequency: number;  // times per day/week
  duration: number;   // minutes per occurrence
  period: 'daily' | 'weekly';
  levelOfCare: 'Level 1' | 'Level 2' | 'Level 3';
}

interface CareNeedsCalculation {
  hoursPerDay: number;
  hoursPerMonth: number;
  monthlyRate: number;
  monthlyTotal: number;
}

const CARE_RATES = {
  'Level 1': 14.90,  // Routine personal care
  'Level 2': 14.90,  // Basic supervisory functions
  'Level 3': 22.36   // Complex health/care and hygiene functions
};

export function calculateCareHours(tasks: CareTask[]): Record<string, CareNeedsCalculation> {
  const calculations: Record<string, CareNeedsCalculation> = {
    'Level 1': { hoursPerDay: 0, hoursPerMonth: 0, monthlyRate: CARE_RATES['Level 1'], monthlyTotal: 0 },
    'Level 2': { hoursPerDay: 0, hoursPerMonth: 0, monthlyRate: CARE_RATES['Level 2'], monthlyTotal: 0 },
    'Level 3': { hoursPerDay: 0, hoursPerMonth: 0, monthlyRate: CARE_RATES['Level 3'], monthlyTotal: 0 }
  };

  tasks.forEach(task => {
    let hoursPerDay = 0;
    
    if (task.period === 'daily') {
      hoursPerDay = (task.frequency * task.duration) / 60;
    } else { // weekly
      hoursPerDay = ((task.frequency * task.duration) / 7) / 60;
    }

    calculations[task.levelOfCare].hoursPerDay += hoursPerDay;
  });

  // Calculate monthly totals
  Object.keys(calculations).forEach(level => {
    calculations[level].hoursPerMonth = calculations[level].hoursPerDay * 30.4375; // Average days per month
    calculations[level].monthlyTotal = calculations[level].hoursPerMonth * calculations[level].monthlyRate;
  });

  return calculations;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) {
    return `${remainingMinutes} minutes`;
  } else if (remainingMinutes === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else {
    return `${hours} hour${hours > 1 ? 's' : ''} and ${remainingMinutes} minutes`;
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD'
  }).format(amount);
}