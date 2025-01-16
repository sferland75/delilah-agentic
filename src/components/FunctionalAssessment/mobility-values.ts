export const MOBILITY_CATEGORIES = [
  {
    category: 'Basic Mobility',
    tasks: [
      {
        name: 'Rolling',
        defaultObservation: 'Independently rolls in bed in both directions with proper body mechanics'
      },
      {
        name: 'Supine to Sit',
        defaultObservation: 'Smoothly transitions from lying to sitting using efficient movement pattern'
      },
      {
        name: 'Sit to Stand',
        defaultObservation: 'Rises from seated position with good balance and minimal upper extremity support'
      },
      {
        name: 'Standing Balance',
        defaultObservation: 'Maintains stable standing position, manages minor perturbations appropriately'
      }
    ]
  },
  {
    category: 'Transfers',
    tasks: [
      {
        name: 'Bed Mobility',
        defaultObservation: 'Independently manages bed mobility including position changes'
      },
      {
        name: 'Chair Transfer',
        defaultObservation: 'Safely transfers to/from chairs with good technique and body mechanics'
      },
      {
        name: 'Toilet Transfer',
        defaultObservation: 'Manages bathroom transfers independently with appropriate safety awareness'
      },
      {
        name: 'Car Transfer',
        defaultObservation: 'Safely enters/exits vehicle using proper sequencing and technique'
      }
    ]
  },
  {
    category: 'Ambulation',
    tasks: [
      {
        name: 'Indoor Walking',
        defaultObservation: 'Walks indoors with stable gait pattern and good safety awareness'
      },
      {
        name: 'Outdoor Walking',
        defaultObservation: 'Navigates varied outdoor terrain with appropriate adaptations'
      },
      {
        name: 'Stairs',
        defaultObservation: 'Manages stairs reciprocally with good balance and proper hand rail use'
      }
    ]
  }
] as const;

export const INDEPENDENCE_LEVELS = [
  { value: 'Independent', label: 'Independent', description: 'No assistance required' },
  { value: 'Modified Independent', label: 'Modified Independent', description: 'Independent with equipment/modifications' },
  { value: 'Supervision', label: 'Supervision', description: 'Requires standby assistance/cueing' },
  { value: 'Minimum Assist', label: 'Minimum Assist', description: 'Requires <25% physical assistance' },
  { value: 'Moderate Assist', label: 'Moderate Assist', description: '25-50% physical assistance' },
  { value: 'Maximum Assist', label: 'Maximum Assist', description: '50-75% physical assistance' },
  { value: 'Dependent', label: 'Dependent', description: 'Requires >75% assistance' }
] as const;