export const HOME_LEVELS = [
  'Single Level',
  'Two Story',
  'Split Level',
  'Multiple Levels'
] as const;

export const FLOOR_COVERINGS = [
  'Carpet',
  'Hardwood',
  'Tile',
  'Vinyl',
  'Mixed'
] as const;

export const ROOM_TYPES = [
  { 
    name: 'Bedroom',
    defaultDescription: 'Standard bedroom layout with adequate space for mobility'
  },
  { 
    name: 'Bathroom',
    defaultDescription: 'Standard bathroom with regular fixtures'
  },
  { 
    name: 'Kitchen',
    defaultDescription: 'Standard kitchen layout with typical appliances'
  },
  { 
    name: 'Living Room',
    defaultDescription: 'Open living space with typical furniture arrangement'
  },
  { 
    name: 'Entry/Exit',
    defaultDescription: 'Standard entry/exit points with typical access'
  }
] as const;