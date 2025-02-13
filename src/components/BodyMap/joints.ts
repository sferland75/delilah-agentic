<<<<<<< HEAD
// Constants for anatomical landmarks
const center = 200;
const shoulderLevel = 130;  // Adjusted up slightly
const elbowLevel = 200;     // Added specific elbow level
const waistLevel = 240;     // Adjusted for better proportion
const hipLevel = 280;       // Adjusted to match typical skeletal proportions
const kneeLevel = 420;      // Adjusted down for better leg proportions
const ankleLevel = 520;     // Adjusted down for better foot position

// Define joint positions and movements for body map
export const joints = {
  // Cervical (neck) - Adjusted position and movements
  cervical: { 
    cx: center, cy: 118, r: 6,  // Moved to 118 as requested
    label: "Cervical Spine",
    movements: [
      "flexion",
      "extension",
      "right rotation",
      "left rotation",
      "right lateral flexion",
      "left lateral flexion"
    ],
    view: "both"
  },

  // Shoulders - Adjusted to match glenohumeral joint position
  rightShoulder: { 
    cx: center-60, cy: shoulderLevel, r: 7,
=======
// Define joint positions and movements for body map
export const joints = {
  // Cervical spine in anterior view
  cervical: { 
    cx: 200, cy: 65, r: 6,
    label: "Cervical Spine",
    movements: ["flexion", "extension", "rotation", "lateral flexion"],
    view: "front"
  },

  // Base joints remain the same
  rightShoulder: { 
    cx: 165, cy: 90, r: 8,
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    label: "Right Shoulder",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },
  leftShoulder: { 
<<<<<<< HEAD
    cx: center+60, cy: shoulderLevel, r: 7,
=======
    cx: 235, cy: 90, r: 8,
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    label: "Left Shoulder",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },
<<<<<<< HEAD

  // Elbows
  rightElbow: { 
    cx: center-65, cy: elbowLevel, r: 6,
    label: "Right Elbow",
    movements: ["flexion", "extension", "pronation", "supination"],
    view: "both"
  },
  leftElbow: { 
    cx: center+65, cy: elbowLevel, r: 6,
    label: "Left Elbow",
    movements: ["flexion", "extension", "pronation", "supination"],
    view: "both"
  },

  // Wrists
  rightWrist: {
    cx: center-65, cy: 260, r: 5,
=======
  rightElbow: { 
    cx: 150, cy: 150, r: 6,
    label: "Right Elbow",
    movements: ["flexion", "extension", "supination", "pronation"],
    view: "both"
  },
  leftElbow: { 
    cx: 250, cy: 150, r: 6,
    label: "Left Elbow",
    movements: ["flexion", "extension", "supination", "pronation"],
    view: "both"
  },
  rightWrist: { 
    cx: 140, cy: 200, r: 6,
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    label: "Right Wrist",
    movements: ["flexion", "extension", "radial deviation", "ulnar deviation"],
    view: "both"
  },
<<<<<<< HEAD
  leftWrist: {
    cx: center+65, cy: 260, r: 5,
=======
  leftWrist: { 
    cx: 260, cy: 200, r: 6,
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    label: "Left Wrist",
    movements: ["flexion", "extension", "radial deviation", "ulnar deviation"],
    view: "both"
  },
<<<<<<< HEAD

  // Hips
  rightHip: { 
    cx: center-45, cy: hipLevel, r: 7,
=======
  rightHip: { 
    cx: 180, cy: 220, r: 8,
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    label: "Right Hip",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },
  leftHip: { 
<<<<<<< HEAD
    cx: center+45, cy: hipLevel, r: 7,
=======
    cx: 220, cy: 220, r: 8,
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    label: "Left Hip",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },
<<<<<<< HEAD

  // Knees
  rightKnee: { 
    cx: center-45, cy: kneeLevel, r: 6,
=======
  rightKnee: { 
    cx: 175, cy: 320, r: 7,
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    label: "Right Knee",
    movements: ["flexion", "extension"],
    view: "both"
  },
  leftKnee: { 
<<<<<<< HEAD
    cx: center+45, cy: kneeLevel, r: 6,
=======
    cx: 225, cy: 320, r: 7,
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    label: "Left Knee",
    movements: ["flexion", "extension"],
    view: "both"
  },
<<<<<<< HEAD

  // Ankles
  rightAnkle: { 
    cx: center-45, cy: ankleLevel, r: 5,
=======
  rightAnkle: { 
    cx: 170, cy: 420, r: 6,
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    label: "Right Ankle",
    movements: ["dorsiflexion", "plantarflexion", "inversion", "eversion"],
    view: "both"
  },
  leftAnkle: { 
<<<<<<< HEAD
    cx: center+45, cy: ankleLevel, r: 5,
=======
    cx: 230, cy: 420, r: 6,
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    label: "Left Ankle",
    movements: ["dorsiflexion", "plantarflexion", "inversion", "eversion"],
    view: "both"
  },

<<<<<<< HEAD
  // Spine levels (posterior view only)
  thoracicSpine: {
    cx: center, cy: 160, r: 6,
    label: "Thoracic Spine",
    movements: ["flexion", "extension", "rotation"],
    view: "back"
  },
  
  lumbarSpine: {
    cx: center, cy: waistLevel, r: 6,
    label: "Lumbar Spine",
    movements: ["flexion", "extension", "rotation"],
=======
  // Single trunk assessment point (posterior view only)
  trunk: {
    cx: 200, cy: 140, r: 8,
    label: "Trunk",
    movements: ["flexion", "reaching forward", "reaching down", "reaching overhead"],
>>>>>>> 5b8c461ac0328f7c90151fedd7d552697eff6801
    view: "back"
  }
};