export const CORE_JOINTS = [
  {
    joint: 'Cervical Spine',
    movements: [
      { name: 'Flexion/Extension', normalROM: '0-45°' },
      { name: 'Lateral Flexion', normalROM: '0-45°' },
      { name: 'Rotation', normalROM: '0-80°' }
    ]
  },
  {
    joint: 'Trunk',
    movements: [
      { name: 'Flexion', normalROM: '0-80°' },
      { name: 'Extension', normalROM: '0-25°' },
      { name: 'Lateral Flexion', normalROM: '0-35°' },
      { name: 'Rotation', normalROM: '0-45°' }
    ]
  },
  {
    joint: 'Shoulder',
    movements: [
      { name: 'Flexion', normalROM: '0-180°' },
      { name: 'Abduction', normalROM: '0-180°' },
      { name: 'Internal/External Rotation', normalROM: '0-90°' }
    ]
  },
  {
    joint: 'Hip',
    movements: [
      { name: 'Flexion', normalROM: '0-125°' },
      { name: 'Extension', normalROM: '0-10°' },
      { name: 'Abduction', normalROM: '0-45°' }
    ]
  },
  {
    joint: 'Knee',
    movements: [
      { name: 'Flexion', normalROM: '0-135°' },
      { name: 'Extension', normalROM: '135-0°' }
    ]
  },
  {
    joint: 'Ankle',
    movements: [
      { name: 'Dorsiflexion', normalROM: '0-20°' },
      { name: 'Plantarflexion', normalROM: '0-45°' }
    ]
  }
] as const;

export const ROM_PERCENTAGES = [
  { value: 100, label: '100% - Full Range' },
  { value: 75, label: '75% - Moderate Limitation' },
  { value: 50, label: '50% - Significant Limitation' },
  { value: 25, label: '25% - Severe Limitation' },
  { value: 0, label: '0% - No Movement' }
] as const;