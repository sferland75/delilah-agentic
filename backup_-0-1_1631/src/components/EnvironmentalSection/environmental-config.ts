export const environmentalConfigs = {
  rooms: {
    title: 'Room Configuration',
    areas: [
      'Living Room',
      'Kitchen',
      'Primary Bedroom',
      'Secondary Bedroom',
      'Bathroom',
      'Entry',
      'Laundry',
      'Garage',
      'Family Room',
      'Home Office',
      'Storage',
      'Basement',
      'Other'
    ],
    assessmentTypes: {
      accessibility: [
        'No barriers',
        'Minor barriers',
        'Major barriers',
        'Not accessible'
      ],
      safety: [
        'No concerns',
        'Minor concerns',
        'Major concerns',
        'Unsafe'
      ],
      features: [
        'Standard layout',
        'Modified',
        'Fully adapted',
        'Requires modification'
      ]
    }
  },
  exterior: {
    title: 'Exterior Features',
    components: [
      'Driveway',
      'Walkway',
      'Steps',
      'Railing',
      'Entry',
      'Garage',
      'Parking',
      'Lighting',
      'Other'
    ],
    assessmentTypes: {
      accessibility: [
        'Fully accessible',
        'Partially accessible',
        'Limited accessibility',
        'Not accessible'
      ],
      safety: [
        'Safe',
        'Minor hazards',
        'Major hazards',
        'Unsafe'
      ],
      condition: [
        'Excellent',
        'Good',
        'Fair',
        'Poor'
      ]
    }
  },
  propertyTypes: [
    'Single Family Home',
    'Apartment',
    'Condominium',
    'Townhouse',
    'Mobile Home',
    'Duplex',
    'Other'
  ],
  groundTypes: [
    'Level',
    'Sloped',
    'Uneven',
    'Mixed',
    'Other'
  ],
  groundConditions: [
    'Well maintained',
    'Moderate maintenance',
    'Poor maintenance',
    'Hazardous'
  ],
  accessTypes: [
    'Ground level',
    'Steps only',
    'Ramp available',
    'Elevator access',
    'Mixed access'
  ],
  commonHazards: [
    'Poor lighting',
    'Uneven surfaces',
    'Loose railings',
    'Steep stairs',
    'Narrow doorways',
    'High thresholds',
    'Poor drainage',
    'Cluttered pathways',
    'Unsecured rugs',
    'Inadequate grab bars'
  ],
  recommendedModifications: [
    'Add grab bars',
    'Install handrails',
    'Improve lighting',
    'Remove thresholds',
    'Widen doorways',
    'Add ramp',
    'Modify bathroom',
    'Reorganize furniture',
    'Add non-slip surfaces',
    'Install stair lift'
  ]
} as const;

export type AssessmentRating = {
  accessibility: string;
  safety: string;
  features?: string;
  condition?: string;
  notes?: string;
};

export type RoomAssessment = {
  id: string;
  name: string;
  ratings: AssessmentRating;
  measurements?: string;
  recommendations?: string[];
  hazards?: string[];
  modifications?: string[];
};

export type ExteriorFeature = {
  id: string;
  name: string;
  ratings: AssessmentRating;
  details?: string;
  recommendations?: string[];
};

export type PropertyOverview = {
  type: string;
  groundType: string;
  groundCondition: string;
  accessType: string;
  generalNotes?: string;
  recommendedModifications?: string[];
  identifiedHazards?: string[];
};

export type EnvironmentalAssessment = {
  propertyOverview: PropertyOverview;
  rooms: RoomAssessment[];
  exteriorFeatures: ExteriorFeature[];
};