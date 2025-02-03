export const BERG_SCALE_INTERPRETATION = {
  rangeSummary: (score: number): string => {
    if (score >= 56) return 'Independent';
    if (score >= 41) return 'Walking with assistance';
    if (score >= 21) return 'Wheelchair with assistance';
    return 'Wheelchair bound';
  },
  riskLevel: (score: number): string => {
    if (score <= 20) return 'High fall risk';
    if (score <= 40) return 'Medium fall risk';
    return 'Low fall risk';
  }
};