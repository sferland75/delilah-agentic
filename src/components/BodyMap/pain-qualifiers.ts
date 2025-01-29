// Define pain qualifiers by body region
export const painQualifiers = {
  // Head and Neck regions
  head: {
    group: 'Head/Neck',
    qualifiers: [
      'Throbbing',
      'Pulsating',
      'Pressure',
      'Tightness',
      'Radiating',
      'Light Sensitivity',
      'Sound Sensitivity',
      'Dizziness'
    ]
  },
  neck: {
    group: 'Neck',
    qualifiers: [
      'Stiff',
      'Radiating',
      'Limited ROM',
      'Muscle Spasm',
      'Tension',
      'Sharp',
      'Dull Ache'
    ]
  },

  // Upper Extremity regions
  shoulder: {
    group: 'Shoulder',
    qualifiers: [
      'Limited ROM',
      'Weakness',
      'Sharp',
      'Radiating',
      'Impingement',
      'Night Pain',
      'With Overhead',
      'With Reaching'
    ]
  },
  arm: {
    group: 'Arm',
    qualifiers: [
      'Numbness',
      'Tingling',
      'Weakness',
      'Sharp',
      'Radiating',
      'Deep Ache',
      'With Activity'
    ]
  },

  // Trunk regions
  trunk: {
    group: 'Trunk',
    qualifiers: [
      'Sharp',
      'Dull',
      'Muscle Spasm',
      'With Movement',
      'With Breathing',
      'Postural',
      'Radiating'
    ]
  },
  back: {
    group: 'Back',
    qualifiers: [
      'Sharp',
      'Dull',
      'Muscle Spasm',
      'With Bending',
      'With Lifting',
      'Postural',
      'Radiating'
    ]
  },

  // Lower Extremity regions
  hip: {
    group: 'Hip',
    qualifiers: [
      'Limited ROM',
      'Weakness',
      'Sharp',
      'With Weight Bearing',
      'With Stairs',
      'Night Pain',
      'Radiating'
    ]
  },
  knee: {
    group: 'Knee',
    qualifiers: [
      'Sharp',
      'Dull',
      'With Weight Bearing',
      'With Stairs',
      'Instability',
      'Swelling',
      'Locking',
      'Giving Way'
    ]
  },
  leg: {
    group: 'Leg',
    qualifiers: [
      'Numbness',
      'Tingling',
      'Weakness',
      'Cramping',
      'With Walking',
      'With Standing',
      'Night Pain'
    ]
  },
  ankle_foot: {
    group: 'Ankle/Foot',
    qualifiers: [
      'Sharp',
      'Swelling',
      'With Weight Bearing',
      'Instability',
      'Morning Pain',
      'With Walking',
      'With Standing'
    ]
  }
};

// Helper function to get qualifiers based on region
export const getQualifiersForRegion = (regionId: string): string[] => {
  // Map region IDs to qualifier groups
  const regionMapping: { [key: string]: keyof typeof painQualifiers } = {
    // Head/Neck
    'head': 'head',
    'neck_anterior': 'neck',
    'neck_posterior': 'neck',
    
    // Upper Extremity
    'shoulder_l': 'shoulder',
    'shoulder_r': 'shoulder',
    'upper_arm_l': 'arm',
    'upper_arm_r': 'arm',
    'elbow_l': 'arm',
    'elbow_r': 'arm',
    'forearm_l': 'arm',
    'forearm_r': 'arm',
    
    // Trunk
    'chest': 'trunk',
    'abdomen': 'trunk',
    'thoracic': 'back',
    'lumbar': 'back',
    
    // Lower Extremity
    'hip_l': 'hip',
    'hip_r': 'hip',
    'thigh_l': 'leg',
    'thigh_r': 'leg',
    'knee_l': 'knee',
    'knee_r': 'knee',
    'leg_l': 'leg',
    'leg_r': 'leg',
    'ankle_l': 'ankle_foot',
    'ankle_r': 'ankle_foot',
    'foot_l': 'ankle_foot',
    'foot_r': 'ankle_foot'
  };

  const qualifierGroup = regionMapping[regionId];
  return qualifierGroup ? painQualifiers[qualifierGroup].qualifiers : painQualifiers.trunk.qualifiers;
};