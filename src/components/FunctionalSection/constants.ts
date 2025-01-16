export const rangeQualifiers = [
  { value: 'wfl', label: 'WFL' },
  { value: '3/4', label: '3/4 range' },
  { value: '1/2', label: '1/2 range' },
  { value: '1/4', label: '1/4 range' },
  { value: 'nominal', label: 'Nominal' }
] as const;

export const romMovements = {
  cervical: {
    name: "Cervical Spine",
    movements: [
      { id: 'flexion', name: 'Flexion', normalROM: '0-45°' },
      { id: 'extension', name: 'Extension', normalROM: '0-45°' },
      { id: 'leftRotation', name: 'Left Rotation', normalROM: '0-80°' },
      { id: 'rightRotation', name: 'Right Rotation', normalROM: '0-80°' },
      { id: 'leftLateralFlexion', name: 'Left Lateral Flexion', normalROM: '0-45°' },
      { id: 'rightLateralFlexion', name: 'Right Lateral Flexion', normalROM: '0-45°' }
    ]
  },
  shoulder: {
    name: "Shoulder",
    movements: [
      { id: 'flexion', name: 'Flexion', normalROM: '0-180°' },
      { id: 'extension', name: 'Extension', normalROM: '0-60°' },
      { id: 'abduction', name: 'Abduction', normalROM: '0-180°' },
      { id: 'adduction', name: 'Adduction', normalROM: '0-50°' },
      { id: 'internalRotation', name: 'Internal Rotation', normalROM: '0-70°' },
      { id: 'externalRotation', name: 'External Rotation', normalROM: '0-90°' }
    ]
  },
  elbow: {
    name: "Elbow",
    movements: [
      { id: 'flexion', name: 'Flexion', normalROM: '0-150°' },
      { id: 'extension', name: 'Extension', normalROM: '0-0°' },
      { id: 'pronation', name: 'Pronation', normalROM: '0-80°' },
      { id: 'supination', name: 'Supination', normalROM: '0-80°' }
    ]
  },
  wrist: {
    name: "Wrist",
    movements: [
      { id: 'flexion', name: 'Flexion', normalROM: '0-80°' },
      { id: 'extension', name: 'Extension', normalROM: '0-70°' },
      { id: 'radialDeviation', name: 'Radial Deviation', normalROM: '0-20°' },
      { id: 'ulnarDeviation', name: 'Ulnar Deviation', normalROM: '0-30°' }
    ]
  },
  hip: {
    name: "Hip",
    movements: [
      { id: 'flexion', name: 'Flexion', normalROM: '0-125°' },
      { id: 'extension', name: 'Extension', normalROM: '0-10°' },
      { id: 'abduction', name: 'Abduction', normalROM: '0-45°' },
      { id: 'adduction', name: 'Adduction', normalROM: '0-30°' },
      { id: 'internalRotation', name: 'Internal Rotation', normalROM: '0-45°' },
      { id: 'externalRotation', name: 'External Rotation', normalROM: '0-45°' }
    ]
  },
  knee: {
    name: "Knee",
    movements: [
      { id: 'flexion', name: 'Flexion', normalROM: '0-135°' },
      { id: 'extension', name: 'Extension', normalROM: '0-0°' }
    ]
  },
  ankle: {
    name: "Ankle",
    movements: [
      { id: 'dorsalFlexion', name: 'Dorsiflexion', normalROM: '0-20°' },
      { id: 'plantarFlexion', name: 'Plantar Flexion', normalROM: '0-45°' },
      { id: 'inversion', name: 'Inversion', normalROM: '0-35°' },
      { id: 'eversion', name: 'Eversion', normalROM: '0-15°' }
    ]
  }
} as const;

export const mmtGrades = [
  { value: '5', label: '5 - Normal', description: 'Full ROM against gravity with maximal resistance' },
  { value: '4+', label: '4+ - Good+', description: 'Full ROM against gravity with moderate to maximal resistance' },
  { value: '4', label: '4 - Good', description: 'Full ROM against gravity with moderate resistance' },
  { value: '4-', label: '4- - Good-', description: 'Full ROM against gravity with minimal to moderate resistance' },
  { value: '3+', label: '3+ - Fair+', description: 'Full ROM against gravity with minimal resistance' },
  { value: '3', label: '3 - Fair', description: 'Full ROM against gravity' },
  { value: '3-', label: '3- - Fair-', description: 'Completes partial ROM against gravity' },
  { value: '2', label: '2 - Poor', description: 'Full ROM with gravity eliminated' },
  { value: '1', label: '1 - Trace', description: 'Evidence of muscle contraction, no joint motion' },
  { value: '0', label: '0 - Zero', description: 'No muscle contraction palpated' }
];

export const muscleGroups = {
  shoulder: {
    name: 'Shoulder',
    muscles: [
      { id: 'flexors', name: 'Flexors', primaryMuscles: 'Anterior Deltoid, Coracobrachialis' },
      { id: 'extensors', name: 'Extensors', primaryMuscles: 'Posterior Deltoid, Latissimus Dorsi' },
      { id: 'abductors', name: 'Abductors', primaryMuscles: 'Middle Deltoid, Supraspinatus' },
      { id: 'adductors', name: 'Adductors', primaryMuscles: 'Pectoralis Major, Latissimus Dorsi' },
      { id: 'internalRotators', name: 'Internal Rotators', primaryMuscles: 'Subscapularis, Pectoralis Major' },
      { id: 'externalRotators', name: 'External Rotators', primaryMuscles: 'Infraspinatus, Teres Minor' }
    ]
  },
  elbow: {
    name: 'Elbow',
    muscles: [
      { id: 'flexors', name: 'Flexors', primaryMuscles: 'Biceps Brachii, Brachialis' },
      { id: 'extensors', name: 'Extensors', primaryMuscles: 'Triceps Brachii' }
    ]
  },
  forearm: {
    name: 'Forearm',
    muscles: [
      { id: 'pronators', name: 'Pronators', primaryMuscles: 'Pronator Teres, Pronator Quadratus' },
      { id: 'supinators', name: 'Supinators', primaryMuscles: 'Supinator, Biceps Brachii' }
    ]
  },
  wrist: {
    name: 'Wrist',
    muscles: [
      { id: 'flexors', name: 'Flexors', primaryMuscles: 'Flexor Carpi Radialis, Flexor Carpi Ulnaris' },
      { id: 'extensors', name: 'Extensors', primaryMuscles: 'Extensor Carpi Radialis, Extensor Carpi Ulnaris' }
    ]
  },
  hip: {
    name: 'Hip',
    muscles: [
      { id: 'flexors', name: 'Flexors', primaryMuscles: 'Iliopsoas, Rectus Femoris' },
      { id: 'extensors', name: 'Extensors', primaryMuscles: 'Gluteus Maximus, Hamstrings' },
      { id: 'abductors', name: 'Abductors', primaryMuscles: 'Gluteus Medius, Gluteus Minimus, TFL' },
      { id: 'adductors', name: 'Adductors', primaryMuscles: 'Adductor Magnus, Longus, Brevis' },
      { id: 'internalRotators', name: 'Internal Rotators', primaryMuscles: 'Gluteus Medius (anterior), TFL' },
      { id: 'externalRotators', name: 'External Rotators', primaryMuscles: 'Piriformis, Obturators, Gemelli' }
    ]
  },
  knee: {
    name: 'Knee',
    muscles: [
      { id: 'flexors', name: 'Flexors', primaryMuscles: 'Hamstrings (Biceps Femoris, Semitendinosus)' },
      { id: 'extensors', name: 'Extensors', primaryMuscles: 'Quadriceps (Rectus Femoris, Vastii)' }
    ]
  },
  ankle: {
    name: 'Ankle',
    muscles: [
      { id: 'dorsiflexors', name: 'Dorsiflexors', primaryMuscles: 'Tibialis Anterior, Extensor Digitorum Longus' },
      { id: 'plantarflexors', name: 'Plantarflexors', primaryMuscles: 'Gastrocnemius, Soleus' },
      { id: 'invertors', name: 'Invertors', primaryMuscles: 'Tibialis Posterior, Tibialis Anterior' },
      { id: 'evertors', name: 'Evertors', primaryMuscles: 'Peroneus Longus, Peroneus Brevis' }
    ]
  }
};