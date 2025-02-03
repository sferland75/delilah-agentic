// Constants for anatomical landmarks
const center = 200;
const shoulderLevel = 120;
const waistLevel = 220;
const hipLevel = 270;
const kneeLevel = 380;
const ankleLevel = 480;

// Define joint positions and movements for body map
export const joints = {
  // Cervical (neck)
  cervical: { 
    cx: center, cy: 100, r: 6,
    label: "Cervical Spine",
    movements: ["flexion", "extension", "rotation", "lateral flexion"],
    view: "both"
  },

  // Shoulders
  rightShoulder: { 
    cx: center-80, cy: shoulderLevel, r: 7,  // Wider shoulder position
    label: "Right Shoulder",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },
  leftShoulder: { 
    cx: center+80, cy: shoulderLevel, r: 7,  // Wider shoulder position
    label: "Left Shoulder",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },

  // Elbows
  rightElbow: { 
    cx: center-75, cy: 180, r: 6,
    label: "Right Elbow",
    movements: ["flexion", "extension"],
    view: "both"
  },
  leftElbow: { 
    cx: center+75, cy: 180, r: 6,
    label: "Left Elbow",
    movements: ["flexion", "extension"],
    view: "both"
  },

  // Hips
  rightHip: { 
    cx: center-70, cy: hipLevel, r: 7,
    label: "Right Hip",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },
  leftHip: { 
    cx: center+70, cy: hipLevel, r: 7,
    label: "Left Hip",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },

  // Knees
  rightKnee: { 
    cx: center-70, cy: kneeLevel, r: 6,
    label: "Right Knee",
    movements: ["flexion", "extension"],
    view: "both"
  },
  leftKnee: { 
    cx: center+70, cy: kneeLevel, r: 6,
    label: "Left Knee",
    movements: ["flexion", "extension"],
    view: "both"
  },

  // Ankles
  rightAnkle: { 
    cx: center-70, cy: ankleLevel, r: 5,
    label: "Right Ankle",
    movements: ["dorsiflexion", "plantarflexion", "inversion", "eversion"],
    view: "both"
  },
  leftAnkle: { 
    cx: center+70, cy: ankleLevel, r: 5,
    label: "Left Ankle",
    movements: ["dorsiflexion", "plantarflexion", "inversion", "eversion"],
    view: "both"
  },

  // Spine levels (posterior view only)
  thoracic: {
    cx: center, cy: 160, r: 6,
    label: "Thoracic Spine",
    movements: ["flexion", "extension", "rotation"],
    view: "back"
  },
  lumbar: {
    cx: center, cy: 220, r: 6,
    label: "Lumbar Spine",
    movements: ["flexion", "extension", "rotation"],
    view: "back"
  }
};