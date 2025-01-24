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
};