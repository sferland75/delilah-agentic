# Range of Motion (ROM) and Manual Muscle Testing (MMT) Assessment Structure

## Data Structure

### Range of Motion
```typescript
rangeOfMotion: {
  generalNotes: string;
  assessments: {
    [jointId: string]: {
      score: string;          // Fraction format "X/Y"
      notes: string;
      painLeft?: boolean;     // For bilateral joints
      painRight?: boolean;    // For bilateral joints
      pain?: boolean;         // For central/single joints
      type: "ROM";
      joint: string;          // Joint identifier
      label: string;          // Display name
      isActive: boolean;      // Tracks if assessment was performed
      lastAssessed?: Date;    // Date of last assessment
    }
  }
}
```

### Manual Muscle Testing
```typescript
manualMuscleTesting: {
  generalNotes: string;
  assessments: {
    [segmentId: string]: {
      score: string;          // "0" to "5" with +/- modifiers
      notes: string;
      pain: boolean;
      type: "MMT";
      segment: string;        // Muscle/segment identifier
      label: string;          // Display name
      isActive: boolean;      // Tracks if assessment was performed
      lastAssessed?: Date;    // Date of last assessment
    }
  }
}
```

## ROM Scoring
- Fractions represent percentage of normal range
- Example: "3/4" indicates 75% of normal range
- Common format: X/Y where Y is typically 4

## MMT Scoring
0: No contraction
1: Trace contraction
2: Poor, gravity eliminated
3: Fair, against gravity
4: Good, against some resistance
5: Normal strength

Modifiers:
- "+": Slightly better than grade
- "-": Slightly worse than grade