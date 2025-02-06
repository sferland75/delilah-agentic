interface Segment {
  path: string;
  label: string;
  associatedSymptoms?: string[];
}

interface SegmentMap {
  [key: string]: Segment;
}

const center = 200;
const headY = 60;
const neckY = 110;
const shoulderY = 130;
const chestY = 180;
const waistY = 250;
const hipY = 290;
const pelvisY = 320;
const kneeY = 420;
const ankleY = 520;

const anteriorSegments: SegmentMap = {
  // Head (circular)
  head: {
    path: `M ${center-30},${headY+30} 
           a 30,30 0 1,1 60,0 
           a 30,30 0 1,1 -60,0`,
    label: 'Head'
  },

  // Neck
  neck: {
    path: `M ${center-20},${neckY} 
           L ${center+20},${neckY} 
           L ${center+15},${shoulderY} 
           L ${center-15},${shoulderY} Z`,
    label: 'Neck'
  },

  // Shoulders
  leftShoulder: {
    path: `M ${center-15},${shoulderY} 
           L ${center-70},${shoulderY+10} 
           L ${center-65},${shoulderY+30} 
           L ${center-20},${shoulderY+20} Z`,
    label: 'Left Shoulder'
  },
  rightShoulder: {
    path: `M ${center+15},${shoulderY} 
           L ${center+70},${shoulderY+10} 
           L ${center+65},${shoulderY+30} 
           L ${center+20},${shoulderY+20} Z`,
    label: 'Right Shoulder'
  },

  // Arms
  leftUpperArm: {
    path: `M ${center-65},${shoulderY+30} 
           L ${center-70},${chestY+20} 
           L ${center-55},${chestY+20} 
           L ${center-50},${shoulderY+30} Z`,
    label: 'Left Upper Arm'
  },
  rightUpperArm: {
    path: `M ${center+50},${shoulderY+30} 
           L ${center+65},${shoulderY+30} 
           L ${center+70},${chestY+20} 
           L ${center+55},${chestY+20} Z`,
    label: 'Right Upper Arm'
  },

  leftForearm: {
    path: `M ${center-70},${chestY+25} 
           L ${center-55},${chestY+25} 
           L ${center-52},${waistY} 
           L ${center-67},${waistY} Z`,
    label: 'Left Forearm'
  },
  rightForearm: {
    path: `M ${center+55},${chestY+25} 
           L ${center+70},${chestY+25} 
           L ${center+67},${waistY} 
           L ${center+52},${waistY} Z`,
    label: 'Right Forearm'
  },

  // Hands
  leftHand: {
    path: `M ${center-67},${waistY+5} 
           L ${center-52},${waistY+5} 
           L ${center-52},${waistY+25} 
           L ${center-67},${waistY+25} Z`,
    label: 'Left Hand'
  },
  rightHand: {
    path: `M ${center+52},${waistY+5} 
           L ${center+67},${waistY+5} 
           L ${center+67},${waistY+25} 
           L ${center+52},${waistY+25} Z`,
    label: 'Right Hand'
  },

  // Torso
  upperChest: {
    path: `M ${center-45},${shoulderY+20} 
           L ${center+45},${shoulderY+20} 
           L ${center+40},${chestY} 
           L ${center-40},${chestY} Z`,
    label: 'Upper Chest'
  },
  lowerChest: {
    path: `M ${center-40},${chestY} 
           L ${center+40},${chestY} 
           L ${center+35},${waistY} 
           L ${center-35},${waistY} Z`,
    label: 'Lower Chest'
  },

  // Pelvis
  pelvis: {
    path: `M ${center-40},${waistY} 
           L ${center+40},${waistY} 
           L ${center+45},${pelvisY} 
           L ${center-45},${pelvisY} Z`,
    label: 'Pelvis'
  },

  // Legs
  leftThigh: {
    path: `M ${center-35},${pelvisY} 
           L ${center-15},${pelvisY} 
           L ${center-15},${kneeY} 
           L ${center-35},${kneeY} Z`,
    label: 'Left Thigh'
  },
  rightThigh: {
    path: `M ${center+15},${pelvisY} 
           L ${center+35},${pelvisY} 
           L ${center+35},${kneeY} 
           L ${center+15},${kneeY} Z`,
    label: 'Right Thigh'
  },

  leftLowerLeg: {
    path: `M ${center-35},${kneeY+5} 
           L ${center-15},${kneeY+5} 
           L ${center-15},${ankleY} 
           L ${center-35},${ankleY} Z`,
    label: 'Left Lower Leg'
  },
  rightLowerLeg: {
    path: `M ${center+15},${kneeY+5} 
           L ${center+35},${kneeY+5} 
           L ${center+35},${ankleY} 
           L ${center+15},${ankleY} Z`,
    label: 'Right Lower Leg'
  },

  // Feet
  leftFoot: {
    path: `M ${center-35},${ankleY+5} 
           L ${center-15},${ankleY+5} 
           L ${center-15},${ankleY+25} 
           L ${center-35},${ankleY+25} Z`,
    label: 'Left Foot'
  },
  rightFoot: {
    path: `M ${center+15},${ankleY+5} 
           L ${center+35},${ankleY+5} 
           L ${center+35},${ankleY+25} 
           L ${center+15},${ankleY+25} Z`,
    label: 'Right Foot'
  }
};

// Posterior segments
const posteriorSegments: SegmentMap = {
  // Back of head
  headBack: {
    path: `M ${center-30},${headY+32} 
           a 30,30 0 1,1 60,0 
           a 30,30 0 1,1 -60,0`,
    label: 'Back of Head'
  },

  // Spine segments
  cervicalSpine: {
    path: `M ${center-15},${neckY} 
           L ${center+15},${neckY} 
           L ${center+15},${shoulderY} 
           L ${center-15},${shoulderY} Z`,
    label: 'Cervical Spine'
  },
  
  thoracicSpine: {
    path: `M ${center-20},${shoulderY+20} 
           L ${center+20},${shoulderY+20} 
           L ${center+20},${chestY+30} 
           L ${center-20},${chestY+30} Z`,
    label: 'Thoracic Spine'
  },
  
  lumbarSpine: {
    path: `M ${center-25},${chestY+35} 
           L ${center+25},${chestY+35} 
           L ${center+25},${waistY} 
           L ${center-25},${waistY} Z`,
    label: 'Lumbar Spine'
  },

  // Sacral spine
  sacralSpine: {
    path: `M ${center-25},${waistY} 
           L ${center+25},${waistY} 
           L ${center+30},${pelvisY} 
           L ${center-30},${pelvisY} Z`,
    label: 'Sacral Spine'
  },

  // Posterior pelvis
  pelvisBack: {
    path: `M ${center-40},${waistY} 
           L ${center+40},${waistY} 
           L ${center+45},${pelvisY} 
           L ${center-45},${pelvisY} Z`,
    label: 'Posterior Pelvis'
  },

  // Back muscles
  leftUpperTrap: { 
    path: anteriorSegments.leftShoulder.path, 
    label: 'Left Upper Trapezius' 
  },
  rightUpperTrap: { 
    path: anteriorSegments.rightShoulder.path, 
    label: 'Right Upper Trapezius' 
  },
  leftPosteriorArm: { 
    path: anteriorSegments.leftUpperArm.path, 
    label: 'Left Posterior Arm' 
  },
  rightPosteriorArm: { 
    path: anteriorSegments.rightUpperArm.path, 
    label: 'Right Posterior Arm' 
  },
  leftHamstring: { 
    path: anteriorSegments.leftThigh.path, 
    label: 'Left Hamstring' 
  },
  rightHamstring: { 
    path: anteriorSegments.rightThigh.path, 
    label: 'Right Hamstring' 
  },
  leftCalf: { 
    path: anteriorSegments.leftLowerLeg.path, 
    label: 'Left Calf' 
  },
  rightCalf: { 
    path: anteriorSegments.rightLowerLeg.path, 
    label: 'Right Calf' 
  }
};

const locationToSegmentMap: Record<string, string[]> = {
  'Head': ['head', 'headBack'],
  'Neck': ['neck', 'cervicalSpine'],
  'Left Shoulder': ['leftShoulder', 'leftUpperTrap'],
  'Right Shoulder': ['rightShoulder', 'rightUpperTrap'],
  'Upper Back': ['thoracicSpine'],
  'Lower Back': ['lumbarSpine'],
  'Sacral Area': ['sacralSpine'],
  'Pelvis': ['pelvis', 'pelvisBack'],
  'Left Upper Arm': ['leftUpperArm', 'leftPosteriorArm'],
  'Right Upper Arm': ['rightUpperArm', 'rightPosteriorArm'],
  'Left Forearm': ['leftForearm'],
  'Right Forearm': ['rightForearm'],
  'Left Hand': ['leftHand'],
  'Right Hand': ['rightHand'],
  'Left Thigh': ['leftThigh', 'leftHamstring'],
  'Right Thigh': ['rightThigh', 'rightHamstring'],
  'Left Lower Leg': ['leftLowerLeg', 'leftCalf'],
  'Right Lower Leg': ['rightLowerLeg', 'rightCalf'],
  'Left Foot': ['leftFoot'],
  'Right Foot': ['rightFoot']
};

export { 
  anteriorSegments, 
  posteriorSegments, 
  locationToSegmentMap, 
  type Segment, 
  type SegmentMap 
};