<<<<<<< HEAD
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
    path: `M ${center-30},${headY+30} a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0`,
    label: 'Head'
  },

  // Neck
  neck: {
    path: `M ${center-20},${neckY} L ${center+20},${neckY} L ${center+15},${shoulderY} L ${center-15},${shoulderY} Z`,
    label: 'Anterior Neck'
  },

  // Shoulders
  leftShoulder: {
    path: `M ${center-15},${shoulderY} L ${center-70},${shoulderY+10} L ${center-65},${shoulderY+30} L ${center-20},${shoulderY+20} Z`,
    label: 'Left Shoulder'
  },
  rightShoulder: {
    path: `M ${center+15},${shoulderY} L ${center+70},${shoulderY+10} L ${center+65},${shoulderY+30} L ${center+20},${shoulderY+20} Z`,
    label: 'Right Shoulder'
  },

  // Arms
  leftUpperArm: {
    path: `M ${center-65},${shoulderY+30} L ${center-70},${chestY+20} L ${center-55},${chestY+20} L ${center-50},${shoulderY+30} Z`,
    label: 'Left Upper Arm'
  },
  rightUpperArm: {
    path: `M ${center+50},${shoulderY+30} L ${center+65},${shoulderY+30} L ${center+70},${chestY+20} L ${center+55},${chestY+20} Z`,
    label: 'Right Upper Arm'
  },

  leftForearm: {
    path: `M ${center-70},${chestY+25} L ${center-55},${chestY+25} L ${center-52},${waistY} L ${center-67},${waistY} Z`,
    label: 'Left Forearm'
  },
  rightForearm: {
    path: `M ${center+55},${chestY+25} L ${center+70},${chestY+25} L ${center+67},${waistY} L ${center+52},${waistY} Z`,
    label: 'Right Forearm'
  },

  // Hands
  leftHand: {
    path: `M ${center-67},${waistY+5} L ${center-52},${waistY+5} L ${center-52},${waistY+25} L ${center-67},${waistY+25} Z`,
    label: 'Left Hand'
  },
  rightHand: {
    path: `M ${center+52},${waistY+5} L ${center+67},${waistY+5} L ${center+67},${waistY+25} L ${center+52},${waistY+25} Z`,
    label: 'Right Hand'
  },

  // Torso
  upperChest: {
    path: `M ${center-45},${shoulderY+20} L ${center+45},${shoulderY+20} L ${center+40},${chestY} L ${center-40},${chestY} Z`,
    label: 'Upper Chest'
  },
  lowerChest: {
    path: `M ${center-40},${chestY} L ${center+40},${chestY} L ${center+35},${waistY} L ${center-35},${waistY} Z`,
    label: 'Lower Chest'
  },

  // Pelvis
  pelvis: {
    path: `M ${center-40},${waistY} L ${center+40},${waistY} L ${center+45},${pelvisY} L ${center-45},${pelvisY} Z`,
    label: 'Pelvis'
  },

  // Legs
  leftThigh: {
    path: `M ${center-35},${pelvisY} L ${center-15},${pelvisY} L ${center-15},${kneeY} L ${center-35},${kneeY} Z`,
    label: 'Left Thigh'
  },
  rightThigh: {
    path: `M ${center+15},${pelvisY} L ${center+35},${pelvisY} L ${center+35},${kneeY} L ${center+15},${kneeY} Z`,
    label: 'Right Thigh'
  },

  leftLowerLeg: {
    path: `M ${center-35},${kneeY+5} L ${center-15},${kneeY+5} L ${center-15},${ankleY} L ${center-35},${ankleY} Z`,
    label: 'Left Lower Leg'
  },
  rightLowerLeg: {
    path: `M ${center+15},${kneeY+5} L ${center+35},${kneeY+5} L ${center+35},${ankleY} L ${center+15},${ankleY} Z`,
    label: 'Right Lower Leg'
  },

  // Feet
  leftFoot: {
    path: `M ${center-35},${ankleY+5} L ${center-15},${ankleY+5} L ${center-15},${ankleY+25} L ${center-35},${ankleY+25} Z`,
    label: 'Left Foot'
  },
  rightFoot: {
    path: `M ${center+15},${ankleY+5} L ${center+35},${ankleY+5} L ${center+35},${ankleY+25} L ${center+15},${ankleY+25} Z`,
    label: 'Right Foot'
  }
};

const posteriorSegments: SegmentMap = {
  // Back of head
  headBack: {
    path: `M ${center-30},${headY+32} a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0`,
    label: 'Back of Head'
  },

  // Updated cervical spine to match anterior shape
  cervicalSpine: {
    path: `M ${center-20},${neckY} 
           L ${center+20},${neckY} 
           L ${center+15},${shoulderY} 
           L ${center-15},${shoulderY} Z`,
    label: 'Cervical Spine'
  },
  
  thoracicSpine: {
    path: `M ${center-20},${shoulderY+20} L ${center+20},${shoulderY+20} L ${center+20},${chestY+30} L ${center-20},${chestY+30} Z`,
    label: 'Thoracic Spine'
  },
  
  lumbarSpine: {
    path: `M ${center-25},${chestY+35} L ${center+25},${chestY+35} L ${center+25},${waistY} L ${center-25},${waistY} Z`,
    label: 'Lumbar Spine'
  },

  // Sacral spine
  sacralSpine: {
    path: `M ${center-25},${waistY} L ${center+25},${waistY} L ${center+30},${pelvisY} L ${center-30},${pelvisY} Z`,
    label: 'Sacral Spine'
  },

  // Back muscles
  leftUpperTrap: {
    path: `M ${center-15},${shoulderY} L ${center-70},${shoulderY+15} L ${center-65},${shoulderY+35} L ${center-20},${shoulderY+25} Z`,
    label: 'Left Upper Trapezius'
  },
  rightUpperTrap: {
    path: `M ${center+15},${shoulderY} L ${center+70},${shoulderY+15} L ${center+65},${shoulderY+35} L ${center+20},${shoulderY+25} Z`,
    label: 'Right Upper Trapezius'
  },
  leftPosteriorArm: {
    path: `M ${center-65},${shoulderY+35} L ${center-70},${chestY+25} L ${center-55},${chestY+25} L ${center-50},${shoulderY+35} Z`,
    label: 'Left Posterior Arm'
  },
  rightPosteriorArm: {
    path: `M ${center+50},${shoulderY+35} L ${center+65},${shoulderY+35} L ${center+70},${chestY+25} L ${center+55},${chestY+25} Z`,
    label: 'Right Posterior Arm'
  },

  // Hamstrings
  leftHamstring: {
    path: `M ${center-35},${pelvisY+5} L ${center-15},${pelvisY+5} L ${center-15},${kneeY+5} L ${center-35},${kneeY+5} Z`,
    label: 'Left Hamstring'
  },
  rightHamstring: {
    path: `M ${center+15},${pelvisY+5} L ${center+35},${pelvisY+5} L ${center+35},${kneeY+5} L ${center+15},${kneeY+5} Z`,
    label: 'Right Hamstring'
  },

  // Calves
  leftCalf: {
    path: `M ${center-35},${kneeY+10} L ${center-15},${kneeY+10} L ${center-15},${ankleY+5} L ${center-35},${ankleY+5} Z`,
    label: 'Left Calf'
  },
  rightCalf: {
    path: `M ${center+15},${kneeY+10} L ${center+35},${kneeY+10} L ${center+35},${ankleY+5} L ${center+15},${ankleY+5} Z`,
    label: 'Right Calf'
  }
};

const locationToSegmentMap: Record<string, string[]> = {
  'Head': ['head', 'headBack'],
  'Anterior Neck': ['neck'],
  'Cervical Spine': ['cervicalSpine'],
  'Left Shoulder': ['leftShoulder', 'leftUpperTrap'],
  'Right Shoulder': ['rightShoulder', 'rightUpperTrap'],
  'Upper Back': ['thoracicSpine'],
  'Lower Back': ['lumbarSpine'],
  'Sacral Area': ['sacralSpine'],
  'Pelvis': ['pelvis'],
  'Left Upper Arm': ['leftUpperArm', 'leftPosteriorArm'],
  'Right Upper Arm': ['rightUpperArm', 'rightPosteriorArm'],
  'Left Forearm': ['leftForearm'],
  'Right Forearm': ['rightForearm'],
  'Left Hand': ['leftHand'],
  'Right Hand': ['rightHand'],
  'Upper Chest': ['upperChest'],
  'Lower Chest': ['lowerChest'],
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
=======
// Anterior view segments
export const anteriorSegments = {
  // [Previous head through forearm segments remain the same]
  head: {
    path: "M 185,30 C 185,30 200,20 215,30 C 220,35 220,45 215,55 L 185,55 C 180,45 180,35 185,30 Z",
    label: "Head"
  },
  neck: {
    path: "M 185,55 L 215,55 L 210,75 L 190,75 Z",
    label: "Neck"
  },
  rightUpperArm: {
    path: "M 170,75 L 150,80 L 145,140 L 165,140 Z",
    label: "Right Upper Arm (Biceps)"
  },
  leftUpperArm: {
    path: "M 230,75 L 250,80 L 255,140 L 235,140 Z",
    label: "Left Upper Arm (Biceps)"
  },
  rightForearm: {
    path: "M 145,140 L 165,140 L 160,180 L 140,180 Z",
    label: "Right Forearm (Anterior)"
  },
  leftForearm: {
    path: "M 235,140 L 255,140 L 260,180 L 240,180 Z",
    label: "Left Forearm (Anterior)"
  },
  // Add wrist and hand segments
  rightWrist: {
    path: "M 140,180 L 160,180 L 158,190 L 138,190 Z",
    label: "Right Wrist"
  },
  leftWrist: {
    path: "M 240,180 L 260,180 L 262,190 L 242,190 Z",
    label: "Left Wrist"
  },
  rightHand: {
    path: "M 138,190 L 158,190 L 155,210 L 135,210 C 134,205 134,195 138,190 Z",
    label: "Right Hand"
  },
  leftHand: {
    path: "M 242,190 L 262,190 L 266,210 L 246,210 C 245,205 245,195 242,190 Z",
    label: "Left Hand"
  },
  rightChest: {
    path: "M 190,75 L 170,75 L 165,140 L 185,140 Z",
    label: "Right Chest"
  },
  leftChest: {
    path: "M 210,75 L 230,75 L 235,140 L 215,140 Z",
    label: "Left Chest"
  },
  sternum: {
    path: "M 185,75 L 215,75 L 215,140 L 185,140 Z",
    label: "Sternum"
  },
  abdomen: {
    path: "M 165,140 L 235,140 L 240,200 L 160,200 Z",
    label: "Abdomen"
  },
  rightThigh: {
    path: "M 160,200 L 200,200 L 195,300 L 155,300 Z",
    label: "Right Thigh/Quadriceps"
  },
  leftThigh: {
    path: "M 200,200 L 240,200 L 245,300 L 205,300 Z",
    label: "Left Thigh/Quadriceps"
  },
  rightLeg: {
    path: "M 155,300 L 195,300 L 190,370 L 150,370 Z",
    label: "Right Lower Leg"
  },
  leftLeg: {
    path: "M 205,300 L 245,300 L 250,370 L 210,370 Z",
    label: "Left Lower Leg"
  },
  // Add ankle and foot segments
  rightAnkle: {
    path: "M 150,370 L 190,370 L 188,385 L 148,385 Z",
    label: "Right Ankle"
  },
  leftAnkle: {
    path: "M 210,370 L 250,370 L 252,385 L 212,385 Z",
    label: "Left Ankle"
  },
  rightFoot: {
    path: "M 148,385 L 188,385 L 190,395 L 146,395 C 145,390 145,387 148,385 Z",
    label: "Right Foot"
  },
  leftFoot: {
    path: "M 212,385 L 252,385 L 254,395 L 210,395 C 209,390 209,387 212,385 Z",
    label: "Left Foot"
  }
};

// Posterior view segments
export const posteriorSegments = {
  // [Previous head through spine segments remain the same]
  head: {
    path: "M 185,30 C 185,30 200,20 215,30 C 220,35 220,45 215,55 L 185,55 C 180,45 180,35 185,30 Z",
    label: "Head"
  },
  cervicalSpine: {
    path: "M 192,55 L 208,55 L 208,95 L 192,95 Z",
    label: "Cervical Spine (C1-C7)"
  },
  rightUpperArmPost: {
    path: "M 170,75 L 150,80 L 145,140 L 165,140 Z",
    label: "Right Upper Arm (Triceps)"
  },
  leftUpperArmPost: {
    path: "M 230,75 L 250,80 L 255,140 L 235,140 Z",
    label: "Left Upper Arm (Triceps)"
  },
  rightForearmPost: {
    path: "M 145,140 L 165,140 L 160,180 L 140,180 Z",
    label: "Right Forearm (Posterior)"
  },
  leftForearmPost: {
    path: "M 235,140 L 255,140 L 260,180 L 240,180 Z",
    label: "Left Forearm (Posterior)"
  },
  rightWristPost: {
    path: "M 140,180 L 160,180 L 158,190 L 138,190 Z",
    label: "Right Wrist (Posterior)"
  },
  leftWristPost: {
    path: "M 240,180 L 260,180 L 262,190 L 242,190 Z",
    label: "Left Wrist (Posterior)"
  },
  rightHandPost: {
    path: "M 138,190 L 158,190 L 155,210 L 135,210 C 134,205 134,195 138,190 Z",
    label: "Right Hand (Posterior)"
  },
  leftHandPost: {
    path: "M 242,190 L 262,190 L 266,210 L 246,210 C 245,205 245,195 242,190 Z",
    label: "Left Hand (Posterior)"
  },
  upperThoracic: {
    path: "M 192,95 L 208,95 L 208,135 L 192,135 Z",
    label: "Upper Thoracic (T1-T6)"
  },
  lowerThoracic: {
    path: "M 192,135 L 208,135 L 208,175 L 192,175 Z",
    label: "Lower Thoracic (T7-T12)"
  },
  lumbar: {
    path: "M 192,175 L 208,175 L 208,200 L 192,200 Z",
    label: "Lumbar Spine (L1-L5)"
  },
  rightScapula: {
    path: "M 165,95 L 192,95 L 192,135 L 165,135 Z",
    label: "Right Scapula"
  },
  leftScapula: {
    path: "M 208,95 L 235,95 L 235,135 L 208,135 Z",
    label: "Left Scapula"
  },
  rightLatissimus: {
    path: "M 165,135 L 192,135 L 192,200 L 160,200 Z",
    label: "Right Latissimus"
  },
  leftLatissimus: {
    path: "M 208,135 L 235,135 L 240,200 L 208,200 Z",
    label: "Left Latissimus"
  },
  rightHamstring: {
    path: "M 160,200 L 200,200 L 195,300 L 155,300 Z",
    label: "Right Hamstring"
  },
  leftHamstring: {
    path: "M 200,200 L 240,200 L 245,300 L 205,300 Z",
    label: "Left Hamstring"
  },
  rightGastrocnemius: {
    path: "M 155,300 L 195,300 L 190,370 L 150,370 Z",
    label: "Right Gastrocnemius"
  },
  leftGastrocnemius: {
    path: "M 205,300 L 245,300 L 250,370 L 210,370 Z",
    label: "Left Gastrocnemius"
  },
  rightAnklePost: {
    path: "M 150,370 L 190,370 L 188,385 L 148,385 Z",
    label: "Right Ankle (Posterior)"
  },
  leftAnklePost: {
    path: "M 210,370 L 250,370 L 252,385 L 212,385 Z",
    label: "Left Ankle (Posterior)"
  },
  rightFootPost: {
    path: "M 148,385 L 188,385 L 190,395 L 146,395 C 145,390 145,387 148,385 Z",
    label: "Right Foot (Posterior)"
  },
  leftFootPost: {
    path: "M 212,385 L 252,385 L 254,395 L 210,395 C 209,390 209,387 212,385 Z",
    label: "Left Foot (Posterior)"
  }
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
};