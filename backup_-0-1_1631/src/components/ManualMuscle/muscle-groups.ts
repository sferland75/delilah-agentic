export const MUSCLE_GROUPS = {
  upper: [
    {
      region: 'Shoulder',
      muscles: [
        { name: 'Deltoid', movements: ['Abduction'] },
        { name: 'Rotator Cuff', movements: ['Internal Rotation', 'External Rotation'] },
        { name: 'Pectoralis Major', movements: ['Flexion', 'Adduction'] },
        { name: 'Latissimus Dorsi', movements: ['Extension', 'Adduction'] }
      ]
    },
    {
      region: 'Elbow',
      muscles: [
        { name: 'Biceps', movements: ['Flexion', 'Supination'] },
        { name: 'Triceps', movements: ['Extension'] },
        { name: 'Brachioradialis', movements: ['Flexion'] }
      ]
    },
    {
      region: 'Wrist/Hand',
      muscles: [
        { name: 'Wrist Flexors', movements: ['Flexion'] },
        { name: 'Wrist Extensors', movements: ['Extension'] },
        { name: 'Grip Strength', movements: ['Grip'] },
        { name: 'Intrinsic Hand', movements: ['Fine Motor'] }
      ]
    }
  ],
  lower: [
    {
      region: 'Hip',
      muscles: [
        { name: 'Hip Flexors', movements: ['Flexion'] },
        { name: 'Hip Extensors', movements: ['Extension'] },
        { name: 'Hip Abductors', movements: ['Abduction'] },
        { name: 'Hip Adductors', movements: ['Adduction'] }
      ]
    },
    {
      region: 'Knee',
      muscles: [
        { name: 'Quadriceps', movements: ['Extension'] },
        { name: 'Hamstrings', movements: ['Flexion'] }
      ]
    },
    {
      region: 'Ankle/Foot',
      muscles: [
        { name: 'Dorsiflexors', movements: ['Dorsiflexion'] },
        { name: 'Plantarflexors', movements: ['Plantarflexion'] },
        { name: 'Invertors', movements: ['Inversion'] },
        { name: 'Evertors', movements: ['Eversion'] }
      ]
    }
  ],
  core: [
    {
      region: 'Trunk',
      muscles: [
        { name: 'Abdominals', movements: ['Flexion'] },
        { name: 'Back Extensors', movements: ['Extension'] },
        { name: 'Lateral Flexors', movements: ['Lateral Flexion'] },
        { name: 'Rotators', movements: ['Rotation'] }
      ]
    }
  ]
} as const;

export const GRADES = [
  { value: 0, label: '0 - No contraction' },
  { value: 1, label: '1 - Flicker/trace of contraction' },
  { value: 2, label: '2 - Active movement, gravity eliminated' },
  { value: 3, label: '3 - Active movement against gravity' },
  { value: 4, label: '4 - Active movement against resistance' },
  { value: 5, label: '5 - Normal strength' }
] as const;

export type MuscleGrade = {
  left: number;
  right: number;
  leftPain: boolean;
  rightPain: boolean;
  notes: string;
};