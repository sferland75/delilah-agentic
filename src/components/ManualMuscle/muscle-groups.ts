export const MMT_GRADES = [
  { value: 5, label: '5 - Normal strength', description: 'Full ROM against gravity with maximal resistance' },
  { value: 4, label: '4 - Good', description: 'Full ROM against gravity with moderate resistance' },
  { value: 3, label: '3 - Fair', description: 'Full ROM against gravity' },
  { value: 2, label: '2 - Poor', description: 'Full ROM with gravity eliminated' },
  { value: 1, label: '1 - Trace', description: 'Visible/palpable contraction' },
  { value: 0, label: '0 - Zero', description: 'No contraction' }
] as const;

export const CORE_MUSCLE_GROUPS = [
  {
    region: 'Upper Body',
    groups: [
      { name: 'Shoulder Flexors/Abductors', description: 'Deltoid, Supraspinatus' },
      { name: 'Elbow Flexors', description: 'Biceps, Brachialis' },
      { name: 'Grip Strength', description: 'Hand intrinsics, Flexor digitorum' }
    ]
  },
  {
    region: 'Core',
    groups: [
      { name: 'Trunk Flexors', description: 'Rectus abdominis' },
      { name: 'Back Extensors', description: 'Erector spinae' }
    ]
  },
  {
    region: 'Lower Body',
    groups: [
      { name: 'Hip Flexors', description: 'Iliopsoas' },
      { name: 'Hip Abductors', description: 'Gluteus medius' },
      { name: 'Knee Extensors', description: 'Quadriceps' },
      { name: 'Ankle Dorsiflexors', description: 'Tibialis anterior' }
    ]
  }
] as const;