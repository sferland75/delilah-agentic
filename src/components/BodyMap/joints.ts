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
    label: "Right Shoulder",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },
  leftShoulder: { 
    cx: 235, cy: 90, r: 8,
    label: "Left Shoulder",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },
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
    label: "Right Wrist",
    movements: ["flexion", "extension", "radial deviation", "ulnar deviation"],
    view: "both"
  },
  leftWrist: { 
    cx: 260, cy: 200, r: 6,
    label: "Left Wrist",
    movements: ["flexion", "extension", "radial deviation", "ulnar deviation"],
    view: "both"
  },
  rightHip: { 
    cx: 180, cy: 220, r: 8,
    label: "Right Hip",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },
  leftHip: { 
    cx: 220, cy: 220, r: 8,
    label: "Left Hip",
    movements: ["flexion", "extension", "abduction", "adduction", "internal rotation", "external rotation"],
    view: "both"
  },
  rightKnee: { 
    cx: 175, cy: 320, r: 7,
    label: "Right Knee",
    movements: ["flexion", "extension"],
    view: "both"
  },
  leftKnee: { 
    cx: 225, cy: 320, r: 7,
    label: "Left Knee",
    movements: ["flexion", "extension"],
    view: "both"
  },
  rightAnkle: { 
    cx: 170, cy: 420, r: 6,
    label: "Right Ankle",
    movements: ["dorsiflexion", "plantarflexion", "inversion", "eversion"],
    view: "both"
  },
  leftAnkle: { 
    cx: 230, cy: 420, r: 6,
    label: "Left Ankle",
    movements: ["dorsiflexion", "plantarflexion", "inversion", "eversion"],
    view: "both"
  },

  // Single trunk assessment point (posterior view only)
  trunk: {
    cx: 200, cy: 140, r: 8,
    label: "Trunk",
    movements: ["flexion", "reaching forward", "reaching down", "reaching overhead"],
    view: "back"
  }
};