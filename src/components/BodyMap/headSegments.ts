const center = 200;
const unit = 10;
const headWidth = unit * 6;   // 60 units
const headHeight = unit * 6;  // 60 units
const headTop = 70;

interface Segment {
  path: string;
  label: string;
  associatedSymptoms?: string[];
}

interface SegmentMap {
  [key: string]: Segment;
}

// LEGO-style box head for anterior view
const anteriorHeadSegments: SegmentMap = {
  head_anterior: {
    path: `M ${center-headWidth/2},${headTop}
           L ${center+headWidth/2},${headTop}
           L ${center+headWidth/2},${headTop+headHeight}
           L ${center-headWidth/2},${headTop+headHeight} Z`,
    label: "Head/Face",
    associatedSymptoms: [
      "Headache",
      "Facial pain",
      "TMJ pain",
      "Visual symptoms",
      "Light sensitivity"
    ]
  }
};

// LEGO-style box head for posterior view
const posteriorHeadSegments: SegmentMap = {
  head_posterior: {
    path: `M ${center-headWidth/2},${headTop}
           L ${center+headWidth/2},${headTop}
           L ${center+headWidth/2},${headTop+headHeight}
           L ${center-headWidth/2},${headTop+headHeight} Z`,
    label: "Head/Neck",
    associatedSymptoms: [
      "Occipital headache",
      "Neck pain",
      "Cervicogenic headache",
      "Base of skull pain"
    ]
  }
};

const headSymptoms = {
  headache: [
    "Tension headache",
    "Migraine",
    "Post-traumatic headache",
    "Cervicogenic headache",
    "Occipital neuralgia"
  ],
  visual: [
    "Light sensitivity",
    "Visual blurring",
    "Double vision",
    "Visual tracking issues",
    "Eye strain"
  ],
  tmj: [
    "TMJ pain",
    "Jaw clicking/popping",
    "Difficulty chewing",
    "Facial pain",
    "Teeth clenching"
  ],
  vestibular: [
    "Dizziness",
    "Vertigo",
    "Balance issues",
    "Motion sensitivity",
    "Spatial disorientation"
  ],
  sensory: [
    "Noise sensitivity",
    "Tinnitus",
    "Facial numbness/tingling",
    "Heightened sensory sensitivity"
  ]
};

export {
  anteriorHeadSegments,
  posteriorHeadSegments,
  headSymptoms
};