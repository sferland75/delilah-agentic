// Core measurements for more anatomically correct proportions
const center = 200;
const shoulderWidth = 160;  // Wider shoulders
const waistWidth = 120;     // Narrower waist
const hipWidth = 140;       // Medium hips

interface Segment {
  path: string;
  label: string;
}

interface SegmentMap {
  [key: string]: Segment;
}

// Anterior view segments (core muscles only)
const anteriorSegments: SegmentMap = {
  // Upper body
  rightNeck: {
    path: `M ${center-30},80 L ${center},80 L ${center},120 L ${center-35},120 Z`,
    label: "Right SCM"
  },
  leftNeck: {
    path: `M ${center},80 L ${center+30},80 L ${center+35},120 L ${center},120 Z`,
    label: "Left SCM"
  },
  
  // Chest and shoulders
  rightPectoralis: {
    path: `M ${center-shoulderWidth/2},120 L ${center},120 L ${center},170 L ${center-waistWidth/2},170 Z`,
    label: "Right Pectoralis"
  },
  leftPectoralis: {
    path: `M ${center},120 L ${center+shoulderWidth/2},120 L ${center+waistWidth/2},170 L ${center},170 Z`,
    label: "Left Pectoralis"
  },

  // Arms
  rightUpperArm: {
    path: `M ${center-shoulderWidth/2},120 L ${center-shoulderWidth/2-30},120 L ${center-shoulderWidth/2-30},180 L ${center-shoulderWidth/2},180 Z`,
    label: "Right Upper Arm"
  },
  leftUpperArm: {
    path: `M ${center+shoulderWidth/2},120 L ${center+shoulderWidth/2+30},120 L ${center+shoulderWidth/2+30},180 L ${center+shoulderWidth/2},180 Z`,
    label: "Left Upper Arm"
  },
  rightForearm: {
    path: `M ${center-shoulderWidth/2-30},180 L ${center-shoulderWidth/2},180 L ${center-shoulderWidth/2},240 L ${center-shoulderWidth/2-30},240 Z`,
    label: "Right Forearm"
  },
  leftForearm: {
    path: `M ${center+shoulderWidth/2+30},180 L ${center+shoulderWidth/2},180 L ${center+shoulderWidth/2},240 L ${center+shoulderWidth/2+30},240 Z`,
    label: "Left Forearm"
  },

  // Core
  upperAbdominals: {
    path: `M ${center-waistWidth/2},170 L ${center+waistWidth/2},170 L ${center+waistWidth/2},220 L ${center-waistWidth/2},220 Z`,
    label: "Upper Abdominals"
  },
  lowerAbdominals: {
    path: `M ${center-waistWidth/2},220 L ${center+waistWidth/2},220 L ${center+hipWidth/2},270 L ${center-hipWidth/2},270 Z`,
    label: "Lower Abdominals"
  },

  // Lower body
  rightQuadriceps: {
    path: `M ${center-hipWidth/2},270 L ${center},270 L ${center},380 L ${center-hipWidth/2},380 Z`,
    label: "Right Quadriceps"
  },
  leftQuadriceps: {
    path: `M ${center},270 L ${center+hipWidth/2},270 L ${center+hipWidth/2},380 L ${center},380 Z`,
    label: "Left Quadriceps"
  },
  rightLeg: {
    path: `M ${center-hipWidth/2},380 L ${center},380 L ${center},480 L ${center-hipWidth/2},480 Z`,
    label: "Right Lower Leg"
  },
  leftLeg: {
    path: `M ${center},380 L ${center+hipWidth/2},380 L ${center+hipWidth/2},480 L ${center},480 Z`,
    label: "Left Lower Leg"
  }
};

// Posterior view segments
const posteriorSegments: SegmentMap = {
  // Upper back
  cervicalParaspinals: {
    path: `M ${center-20},80 L ${center+20},80 L ${center+20},120 L ${center-20},120 Z`,
    label: "Cervical Paraspinals"
  },
  rightUpperTrap: {
    path: `M ${center-shoulderWidth/2},120 L ${center-20},120 L ${center-20},160 L ${center-shoulderWidth/2},160 Z`,
    label: "Right Upper Trapezius"
  },
  leftUpperTrap: {
    path: `M ${center+20},120 L ${center+shoulderWidth/2},120 L ${center+shoulderWidth/2},160 L ${center+20},160 Z`,
    label: "Left Upper Trapezius"
  },

  // Arms
  rightPosteriorArm: {
    path: `M ${center-shoulderWidth/2},120 L ${center-shoulderWidth/2-30},120 L ${center-shoulderWidth/2-30},180 L ${center-shoulderWidth/2},180 Z`,
    label: "Right Triceps"
  },
  leftPosteriorArm: {
    path: `M ${center+shoulderWidth/2},120 L ${center+shoulderWidth/2+30},120 L ${center+shoulderWidth/2+30},180 L ${center+shoulderWidth/2},180 Z`,
    label: "Left Triceps"
  },
  rightPosteriorForearm: {
    path: `M ${center-shoulderWidth/2-30},180 L ${center-shoulderWidth/2},180 L ${center-shoulderWidth/2},240 L ${center-shoulderWidth/2-30},240 Z`,
    label: "Right Posterior Forearm"
  },
  leftPosteriorForearm: {
    path: `M ${center+shoulderWidth/2+30},180 L ${center+shoulderWidth/2},180 L ${center+shoulderWidth/2},240 L ${center+shoulderWidth/2+30},240 Z`,
    label: "Left Posterior Forearm"
  },

  // Mid back
  rightRhomboid: {
    path: `M ${center-shoulderWidth/2},160 L ${center-20},160 L ${center-20},200 L ${center-waistWidth/2},200 Z`,
    label: "Right Rhomboid"
  },
  leftRhomboid: {
    path: `M ${center+20},160 L ${center+shoulderWidth/2},160 L ${center+waistWidth/2},200 L ${center+20},200 Z`,
    label: "Left Rhomboid"
  },
  thoracicSpine: {
    path: `M ${center-20},120 L ${center+20},120 L ${center+20},200 L ${center-20},200 Z`,
    label: "Thoracic Paraspinals"
  },

  // Lower back
  rightLumbar: {
    path: `M ${center-waistWidth/2},200 L ${center-20},200 L ${center-20},270 L ${center-hipWidth/2},270 Z`,
    label: "Right Lumbar"
  },
  leftLumbar: {
    path: `M ${center+20},200 L ${center+waistWidth/2},200 L ${center+hipWidth/2},270 L ${center+20},270 Z`,
    label: "Left Lumbar"
  },
  lumbarSpine: {
    path: `M ${center-20},200 L ${center+20},200 L ${center+20},270 L ${center-20},270 Z`,
    label: "Lumbar Paraspinals"
  },

  // Hips and legs
  rightGluteal: {
    path: `M ${center-hipWidth/2},270 L ${center},270 L ${center},320 L ${center-hipWidth/2},320 Z`,
    label: "Right Gluteal"
  },
  leftGluteal: {
    path: `M ${center},270 L ${center+hipWidth/2},270 L ${center+hipWidth/2},320 L ${center},320 Z`,
    label: "Left Gluteal"
  },
  rightHamstring: {
    path: `M ${center-hipWidth/2},320 L ${center},320 L ${center},380 L ${center-hipWidth/2},380 Z`,
    label: "Right Hamstring"
  },
  leftHamstring: {
    path: `M ${center},320 L ${center+hipWidth/2},320 L ${center+hipWidth/2},380 L ${center},380 Z`,
    label: "Left Hamstring"
  },
  rightCalf: {
    path: `M ${center-hipWidth/2},380 L ${center},380 L ${center},480 L ${center-hipWidth/2},480 Z`,
    label: "Right Calf"
  },
  leftCalf: {
    path: `M ${center},380 L ${center+hipWidth/2},380 L ${center+hipWidth/2},480 L ${center},480 Z`,
    label: "Left Calf"
  }
};

// Location to segment mapping
const locationToSegmentMap: Record<string, string[]> = {
  'Neck': ['rightNeck', 'leftNeck', 'cervicalParaspinals'],
  'Upper Back': ['rightUpperTrap', 'leftUpperTrap', 'thoracicSpine'],
  'Mid Back': ['rightRhomboid', 'leftRhomboid'],
  'Lower Back': ['rightLumbar', 'leftLumbar', 'lumbarSpine'],
  'Chest': ['rightPectoralis', 'leftPectoralis'],
  'Abdomen': ['upperAbdominals', 'lowerAbdominals'],
  'Hip': ['rightGluteal', 'leftGluteal'],
  'Right Hip': ['rightGluteal'],
  'Left Hip': ['leftGluteal'],
  'Right Knee': ['rightQuadriceps', 'rightLeg'],
  'Left Knee': ['leftQuadriceps', 'leftLeg'],
  'Right Thigh': ['rightQuadriceps', 'rightHamstring'],
  'Left Thigh': ['leftQuadriceps', 'leftHamstring'],
  'Right Lower Leg': ['rightLeg', 'rightCalf'],
  'Left Lower Leg': ['leftLeg', 'leftCalf'],
  'Right Shoulder': ['rightUpperTrap', 'rightPectoralis'],
  'Left Shoulder': ['leftUpperTrap', 'leftPectoralis'],
  'Right Upper Arm': ['rightUpperArm', 'rightPosteriorArm'],
  'Left Upper Arm': ['leftUpperArm', 'leftPosteriorArm'],
  'Right Forearm': ['rightForearm', 'rightPosteriorForearm'],
  'Left Forearm': ['leftForearm', 'leftPosteriorForearm']
};

export { anteriorSegments, posteriorSegments, locationToSegmentMap };