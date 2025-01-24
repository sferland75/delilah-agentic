export const DEFAULT_POSTURAL_VALUES = {
  sitting: {
    duration: 45,
    frequency: 12,
    limitations: "Observed during initial interview and assessment. Sat for periods of up to 45 minutes without apparent difficulty. Demonstrated good postural control and maintained upright position. Self-reported ability to sit for longer periods with brief position changes. No apparent distress or discomfort noted during prolonged sitting."
  },
  standing: {
    duration: 30,
    frequency: 8,
    limitations: "Both static and dynamic standing observed during assessment. Maintained standing position during functional tasks. Self-reported ability to stand for longer durations with weight shifting. No significant balance issues noted. Natural transitions between sitting and standing."
  },
  walking: {
    duration: 30,
    frequency: 6,
    limitations: "Observed walking during clinic navigation and functional mobility assessment. Demonstrates normal gait pattern and speed. Self-reported ability to walk longer distances. No assistive devices required. Community ambulation reported without limitations."
  },
  stairs: {
    duration: 5,
    frequency: 4,
    limitations: "Reported regular use of stairs at home and in community. No handrail dependence observed. Maintains reciprocal pattern. Self-reported ability to manage multiple flights when necessary. No significant limitations identified."
  },
  kneeling: {
    duration: 10,
    frequency: 4,
    limitations: "Reports ability to kneel as needed for daily activities. Not directly observed during assessment but self-reported as unrestricted. Can transition to and from kneeling position independently. No reported pain or limitations."
  },
  squatting: {
    duration: 5,
    frequency: 6,
    limitations: "Demonstrated functional squatting during assessment. Maintains good form and balance. Self-reported ability to perform repeated squats for daily tasks. No significant limitations identified in functional mobility."
  },
  bent_over: {
    duration: 10,
    frequency: 8,
    limitations: "Observed during functional reach tasks. Maintains proper spine mechanics. Self-reported ability to perform prolonged tasks in forward bent position. No reported increase in symptoms with position."
  }
} as const;