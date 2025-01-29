import type { AssessmentArea } from './types';

// Body outline with more natural proportions - anterior view
export const BODY_OUTLINE = 
  // Head
  "M 180,20 " +
  "Q 190,15 200,15 " +
  "Q 210,15 220,20 " +
  "Q 225,25 225,35 " +
  "Q 225,50 220,55 " +
  "L 180,55 " +
  "Q 175,50 175,35 " +
  "Q 175,25 180,20 " +
  // Neck
  "M 185,55 " +
  "L 215,55 " +
  "L 212,75 " +
  "L 188,75 " +
  "Z " +
  // Right arm (from anterior view)
  "M 188,75 " +
  "L 165,80 " +
  "L 160,140 " +
  "L 155,145 " +
  "L 150,200 " +
  // Left arm (from anterior view)
  "M 212,75 " +
  "L 235,80 " +
  "L 240,140 " +
  "L 245,145 " +
  "L 250,200 " +
  // Torso
  "M 188,75 " +
  "L 185,220 " +
  "L 215,220 " +
  "L 212,75 " +
  // Legs
  "M 185,220 " +
  "L 185,400 " +
  "M 215,220 " +
  "L 215,400 " +
  "M 175,400 " +
  "L 225,400";

// Circular joints for ROM assessment - anterior view
export const JOINT_CIRCLES = [
  // Shoulders - swapped left/right
  { cx: 235, cy: 80, r: 4, id: 'shoulder_l', label: 'Left Shoulder' },
  { cx: 165, cy: 80, r: 4, id: 'shoulder_r', label: 'Right Shoulder' },
  
  // Elbows - swapped left/right
  { cx: 245, cy: 145, r: 4, id: 'elbow_l', label: 'Left Elbow' },
  { cx: 155, cy: 145, r: 4, id: 'elbow_r', label: 'Right Elbow' },
  
  // Hips - swapped left/right
  { cx: 215, cy: 220, r: 4, id: 'hip_l', label: 'Left Hip' },
  { cx: 185, cy: 220, r: 4, id: 'hip_r', label: 'Right Hip' },
  
  // Knees - swapped left/right
  { cx: 215, cy: 310, r: 4, id: 'knee_l', label: 'Left Knee' },
  { cx: 185, cy: 310, r: 4, id: 'knee_r', label: 'Right Knee' },
  
  // Ankles - swapped left/right
  { cx: 215, cy: 390, r: 4, id: 'ankle_l', label: 'Left Ankle' },
  { cx: 185, cy: 390, r: 4, id: 'ankle_r', label: 'Right Ankle' }
];

// Muscle segments - anterior view with correct left/right
export const ASSESSMENT_AREAS: AssessmentArea[] = [
  // Head (non-interactive, just visual)
  {
    id: 'head',
    path: "M 180,20 " +
          "Q 190,15 200,15 " +
          "Q 210,15 220,20 " +
          "Q 225,25 225,35 " +
          "Q 225,50 220,55 " +
          "L 180,55 " +
          "Q 175,50 175,35 " +
          "Q 175,25 180,20",
    type: 'visual',
    label: 'Head',
    assessments: [],
  },

  // Trunk MMT (single main section)
  {
    id: 'trunk',
    path: "M 188,75 L 212,75 L 215,220 L 185,220 Z",
    type: 'muscle',
    label: 'Trunk MMT',
    assessments: ['MMT'],
  },

  // Upper Extremities - swapped left/right for anterior view
  {
    id: 'upper_arm_r',
    path: "M 165,82 L 188,77 L 183,140 L 160,140 Z",
    type: 'muscle',
    label: 'Right Upper Arm',
    assessments: ['MMT'],
  },
  {
    id: 'upper_arm_l',
    path: "M 212,77 L 235,82 L 240,140 L 217,140 Z",
    type: 'muscle',
    label: 'Left Upper Arm',
    assessments: ['MMT'],
  },
  {
    id: 'forearm_r',
    path: "M 155,147 L 180,147 L 175,200 L 150,200 Z",
    type: 'muscle',
    label: 'Right Forearm',
    assessments: ['MMT'],
  },
  {
    id: 'forearm_l',
    path: "M 220,147 L 245,147 L 250,200 L 225,200 Z",
    type: 'muscle',
    label: 'Left Forearm',
    assessments: ['MMT'],
  },

  // Lower Extremities - swapped left/right for anterior view
  {
    id: 'thigh_r',
    path: "M 185,225 L 200,225 L 200,305 L 185,305 Z",
    type: 'muscle',
    label: 'Right Thigh',
    assessments: ['MMT'],
  },
  {
    id: 'thigh_l',
    path: "M 200,225 L 215,225 L 215,305 L 200,305 Z",
    type: 'muscle',
    label: 'Left Thigh',
    assessments: ['MMT'],
  },
  {
    id: 'leg_r',
    path: "M 185,315 L 200,315 L 200,385 L 185,385 Z",
    type: 'muscle',
    label: 'Right Lower Leg',
    assessments: ['MMT'],
  },
  {
    id: 'leg_l',
    path: "M 200,315 L 215,315 L 215,385 L 200,385 Z",
    type: 'muscle',
    label: 'Left Lower Leg',
    assessments: ['MMT'],
  }
];