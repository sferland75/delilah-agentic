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
  // Cervical (neck)
  cervical: { 
    cx: center, cy: 90, r: 6,
    label: "Cervical Spine",
    movements: ["flexion", "extension", "rotation", "lateral flexion"],
    view: "both"
  },

  // Shoulders - Adjusted to match glenohumeral joint position
  rightShoulder: { 
    cx: center-60, cy: shoulderLevel, r: 7,  // Moved inward for true shoulder joint position
    label: "Right Shoulder",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },
  leftShoulder: { 
    cx: center+60, cy: shoulderLevel, r: 7,  // Moved inward for true shoulder joint position
    label: "Left Shoulder",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },

  // Elbows - Adjusted to proper anatomical height and width
  rightElbow: { 
    cx: center-65, cy: elbowLevel, r: 6,  // Adjusted for proper elbow joint position
    label: "Right Elbow",
    movements: ["flexion", "extension", "pronation", "supination"],
    view: "both"
  },
  leftElbow: { 
    cx: center+65, cy: elbowLevel, r: 6,  // Adjusted for proper elbow joint position
    label: "Left Elbow",
    movements: ["flexion", "extension", "pronation", "supination"],
    view: "both"
  },

  // Wrists - Added wrist joints
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

  // Hips - Adjusted to match true hip joint position
  rightHip: { 
    cx: center-45, cy: hipLevel, r: 7,  // Moved inward to match anatomical hip joint
    label: "Right Hip",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },
  leftHip: { 
    cx: center+45, cy: hipLevel, r: 7,  // Moved inward to match anatomical hip joint
    label: "Left Hip",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },

  // Knees - Adjusted for proper anatomical position
  rightKnee: { 
    cx: center-45, cy: kneeLevel, r: 6,  // Aligned with hip width
    label: "Right Knee",
    movements: ["flexion", "extension"],
    view: "both"
  },
  leftKnee: { 
    cx: center+45, cy: kneeLevel, r: 6,  // Aligned with hip width
    label: "Left Knee",
    movements: ["flexion", "extension"],
    view: "both"
  },

  // Ankles - Adjusted to proper foot position
  rightAnkle: { 
    cx: center-45, cy: ankleLevel, r: 5,  // Aligned with knee
    label: "Right Ankle",
    movements: ["dorsiflexion", "plantarflexion", "inversion", "eversion"],
    view: "both"
  },
  leftAnkle: { 
    cx: center+45, cy: ankleLevel, r: 5,  // Aligned with knee
    label: "Left Ankle",
    movements: ["dorsiflexion", "plantarflexion", "inversion", "eversion"],
    view: "both"
  },

  // Spine levels (posterior view only)
  cervicalSpine: {
    cx: center, cy: 90, r: 6,
    label: "Cervical Spine",
    movements: ["flexion", "extension", "rotation", "lateral flexion"],
    view: "back"
  },
  
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