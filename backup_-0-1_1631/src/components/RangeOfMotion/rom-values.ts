export const DEFAULT_ROM_VALUES = [
  // Cervical Spine
  {
    joint: 'Cervical Spine',
    movement: 'Flexion',
    normalROM: '0-45°',
    left: { active: '45°', passive: '45°' },
    right: { active: '45°', passive: '45°' },
    painLeft: false,
    painRight: false,
    notes: 'No identified limitations.'
  },
  {
    joint: 'Cervical Spine',
    movement: 'Extension',
    normalROM: '0-45°',
    left: { active: '45°', passive: '45°' },
    right: { active: '45°', passive: '45°' },
    painLeft: false,
    painRight: false,
    notes: 'No identified limitations.'
  },
  {
    joint: 'Cervical Spine',
    movement: 'Left Lateral Flexion',
    normalROM: '0-45°',
    left: { active: '45°', passive: '45°' },
    right: { active: '45°', passive: '45°' },
    painLeft: false,
    painRight: false,
    notes: 'No identified limitations.'
  },
  {
    joint: 'Cervical Spine',
    movement: 'Right Lateral Flexion',
    normalROM: '0-45°',
    left: { active: '45°', passive: '45°' },
    right: { active: '45°', passive: '45°' },
    painLeft: false,
    painRight: false,
    notes: 'No identified limitations.'
  },
  {
    joint: 'Cervical Spine',
    movement: 'Left Rotation',
    normalROM: '0-80°',
    left: { active: '80°', passive: '80°' },
    right: { active: '80°', passive: '80°' },
    painLeft: false,
    painRight: false,
    notes: 'No identified limitations.'
  },
  {
    joint: 'Cervical Spine',
    movement: 'Right Rotation',
    normalROM: '0-80°',
    left: { active: '80°', passive: '80°' },
    right: { active: '80°', passive: '80°' },
    painLeft: false,
    painRight: false,
    notes: 'No identified limitations.'
  },
  // Shoulder
  {
    joint: 'Shoulder',
    movement: 'Flexion',
    normalROM: '0-180°',
    left: { active: '180°', passive: '180°' },
    right: { active: '180°', passive: '180°' },
    painLeft: false,
    painRight: false,
    notes: 'No identified limitations.'
  },
  {
    joint: 'Shoulder',
    movement: 'Extension',
    normalROM: '0-60°',
    left: { active: '60°', passive: '60°' },
    right: { active: '60°', passive: '60°' },
    painLeft: false,
    painRight: false,
    notes: 'No identified limitations.'
  },
  {
    joint: 'Shoulder',
    movement: 'Abduction',
    normalROM: '0-180°',
    left: { active: '180°', passive: '180°' },
    right: { active: '180°', passive: '180°' },
    painLeft: false,
    painRight: false,
    notes: 'No identified limitations.'
  },
  {
    joint: 'Shoulder',
    movement: 'Internal Rotation',
    normalROM: '0-70°',
    left: { active: '70°', passive: '70°' },
    right: { active: '70°', passive: '70°' },
    painLeft: false,
    painRight: false,
    notes: 'No identified limitations.'
  },
  {
    joint: 'Shoulder',
    movement: 'External Rotation',
    normalROM: '0-90°',
    left: { active: '90°', passive: '90°' },
    right: { active: '90°', passive: '90°' },
    painLeft: false,
    painRight: false,
    notes: 'No identified limitations.'
  },
  // Elbow
  {
    joint: 'Elbow',
    movement: 'Flexion',
    normalROM: '0-150°',
    left: { active: '150°', passive: '150°' },
    right: { active: '150°', passive: '150°' },
    painLeft: false,
    painRight: false,
    notes: 'No identified limitations.'
  },
  {
    joint: 'Elbow',
    movement: 'Extension',
    normalROM: '150-0°',
    left: { active: '0°', passive: '0°' },
    right: { active: '0°', passive: '0°' },
    painLeft: false,
    painRight: false,
    notes: 'No identified limitations.'
  },
  {
    joint: 'Elbow',
    movement: 'Pronation',
    normalROM: '0-80°',
    left: { active: '80°', passive: '80°' },
    right: { active: '80°', passive: '80°' },
    painLeft: false,
    painRight: false,
    notes: 'No identified limitations.'
  },
  {
    joint: 'Elbow',
    movement: 'Supination',
    normalROM: '0-80°',
    left: { active: '80°', passive: '80°' },
    right: { active: '80°', passive: '80°' },
    painLeft: false,
    painRight: false,
    notes: 'No identified limitations.'
  },
  // Wrist
  {
    joint: 'Wrist',
    movement: 'Flexion',
    normalROM: '0-80°',
    left: { active: '80°', passive: '80°' },
    right: { active: '80°', passive: '80°' },
    painLeft: false,
    painRight: false,
    notes: 'No identified limitations.'
  },
  {
    joint: 'Wrist',
    movement: 'Extension',
    normalROM: '0-70°',
    left: { active: '70°', passive: '70°' },
    right: { active: '70°', passive: '70°' },
    painLeft: false,
    painRight: false,
    notes: 'No identified limitations.'
  },
  {
    joint: 'Wrist',
    movement: 'Radial Deviation',
    normalROM: '0-20°',
    left: { active: '20°', passive: '20°' },
    right: { active: '20°', passive: '20°' },
    painLeft: false,
    painRight: false,
    notes: 'No identified limitations.'
  },
  {
    joint: 'Wrist',
    movement: 'Ulnar Deviation',
    normalROM: '0-30°',
    left: { active: '30°', passive: '30°' },
    right: { active: '30°', passive: '30°' },
    painLeft: false,
    painRight: false,
    notes: 'No identified limitations.'
  }
] as const;

export type ROMValue = typeof DEFAULT_ROM_VALUES[number];