export const AccessibilityLevel = {
  NO_BARRIERS: 'no_barriers',
  MINOR_BARRIERS: 'minor_barriers',
  MAJOR_BARRIERS: 'major_barriers',
  NOT_ACCESSIBLE: 'not_accessible'
} as const;

export const SafetyLevel = {
  NO_CONCERNS: 'no_concerns',
  MINOR_CONCERNS: 'minor_concerns',
  MAJOR_CONCERNS: 'major_concerns',
  UNSAFE: 'unsafe'
} as const;

export const PropertyType = {
  SINGLE_FAMILY: 'single_family_home',
  APARTMENT: 'apartment',
  TOWNHOUSE: 'townhouse',
  CONDOMINIUM: 'condominium',
  MOBILE_HOME: 'mobile_home',
  DUPLEX: 'duplex',
  OTHER: 'other'
} as const;

export const RoomType = {
  LIVING_ROOM: 'living_room',
  KITCHEN: 'kitchen',
  PRIMARY_BEDROOM: 'primary_bedroom',
  SECONDARY_BEDROOM: 'secondary_bedroom',
  BATHROOM: 'bathroom',
  ENTRY: 'entry',
  LAUNDRY: 'laundry',
  GARAGE: 'garage',
  FAMILY_ROOM: 'family_room',
  HOME_OFFICE: 'home_office',
  STORAGE: 'storage',
  BASEMENT: 'basement',
  OTHER: 'other'
} as const;

export type AccessibilityLevel = typeof AccessibilityLevel[keyof typeof AccessibilityLevel];
export type SafetyLevel = typeof SafetyLevel[keyof typeof SafetyLevel];
export type PropertyType = typeof PropertyType[keyof typeof PropertyType];
export type RoomType = typeof RoomType[keyof typeof RoomType];

export interface RoomConfig {
  id: string;
  type: RoomType;
  accessibility: AccessibilityLevel;
  safety: SafetyLevel;
  modifications: string[];
}

export interface OutdoorSpaceConfig {
  id: string;
  type: string;
  accessibility: AccessibilityLevel;
  safety: SafetyLevel;
  modifications: string[];
}
