import {
  AccessibilityLevel,
  SafetyLevel,
  PropertyType,
  RoomType
} from '@/types/environmental';

export const environmentalConfigs = {
  propertyTypes: Object.values(PropertyType),
  roomTypes: Object.values(RoomType),
  accessibilityLevels: Object.values(AccessibilityLevel),
  safetyLevels: Object.values(SafetyLevel),
  
  outdoorSpaceTypes: [
    'Garden',
    'Patio',
    'Driveway',
    'Walkway',
    'Yard',
    'Other'
  ] as const,

  roomFeatures: [
    'Standard layout',
    'Modified',
    'Fully adapted',
    'Requires modification'
  ] as const,

  conditions: [
    'Excellent',
    'Good',
    'Fair',
    'Poor'
  ] as const,
} as const;

export type OutdoorSpaceType = typeof environmentalConfigs.outdoorSpaceTypes[number];
export type RoomFeature = typeof environmentalConfigs.roomFeatures[number];
export type Condition = typeof environmentalConfigs.conditions[number];
