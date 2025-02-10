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
    label: "Right Shoulder",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },
  leftShoulder: { 
    cx: center+60, cy: shoulderLevel, r: 7,
    label: "Left Shoulder",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },

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
    label: "Right Wrist",
    movements: ["flexion", "extension", "radial deviation", "ulnar deviation"],
    view: "both"
  },
  leftWrist: {
    cx: center+65, cy: 260, r: 5,
    label: "Left Wrist",
    movements: ["flexion", "extension", "radial deviation", "ulnar deviation"],
    view: "both"
  },

  // Hips
  rightHip: { 
    cx: center-45, cy: hipLevel, r: 7,
    label: "Right Hip",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },
  leftHip: { 
    cx: center+45, cy: hipLevel, r: 7,
    label: "Left Hip",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },

  // Knees
  rightKnee: { 
    cx: center-45, cy: kneeLevel, r: 6,
    label: "Right Knee",
    movements: ["flexion", "extension"],
    view: "both"
  },
  leftKnee: { 
    cx: center+45, cy: kneeLevel, r: 6,
    label: "Left Knee",
    movements: ["flexion", "extension"],
    view: "both"
  },

  // Ankles
  rightAnkle: { 
    cx: center-45, cy: ankleLevel, r: 5,
    label: "Right Ankle",
    movements: ["dorsiflexion", "plantarflexion", "inversion", "eversion"],
    view: "both"
  },
  leftAnkle: { 
    cx: center+45, cy: ankleLevel, r: 5,
    label: "Left Ankle",
    movements: ["dorsiflexion", "plantarflexion", "inversion", "eversion"],
    view: "both"
  },

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
    view: "back"
  }
};