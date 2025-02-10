export const getJointROMScore = (jointId: string, romData: any, joints: any) => {
  const joint = joints[jointId];
  if (!joint) return 'WFL';

  console.log('getJointROMScore called for:', {
    jointId,
    jointLabel: joint.label,
    side: joint.label.split(' ')[0],
    romData: romData
  });

  // If no data, return WFL
  if (!romData || Object.keys(romData).length === 0) {
    console.log('No ROM data available');
    return 'WFL';
  }

  const key = joint.label.replace(' ', '_');
  console.log('Looking for ROM data with key:', key);

  const jointData = romData[key];
  console.log('Found joint data:', jointData);

  if (!jointData || !jointData.entries || jointData.entries.length === 0) {
    console.log('No entries found for joint');
    return 'WFL';
  }

  // Find the worst score among all entries
  const worstEntry = jointData.entries.reduce((worst: any, entry: any) => {
    const currentScore = getScoreValue(entry.score);
    const worstScore = getScoreValue(worst.score);
    return currentScore < worstScore ? entry : worst;
  }, { score: 'WFL' });

  console.log('Worst score found:', worstEntry.score);
  return worstEntry.score;
};

// Helper function to convert score to numeric value for comparison
const getScoreValue = (score: string): number => {
  switch (score) {
    case 'nominal': return 0;
    case '1/4': return 25;
    case '1/2': return 50;
    case '3/4': return 75;
    case 'WFL': return 100;
    default: return 100;
  }
};

export const getSegmentMMTGrade = (segmentId: string, mmtData: any, segments: any) => {
  const segment = segments[segmentId];
  if (!segment) return '5';

  // Map segments to their corresponding MMT areas and keys
  const segmentMap: { [key: string]: string[] } = {
    'Head': ['Head', 'Neck_Flexors'],
    'Anterior Neck': ['Anterior_Neck', 'Neck_Flexors'],
    'Left Shoulder': ['Left_Shoulder'],
    'Right Shoulder': ['Right_Shoulder'],
    'Left Upper Arm': ['Left_Upper_Arm', 'Left_Biceps', 'Left_Triceps'],
    'Right Upper Arm': ['Right_Upper_Arm', 'Right_Biceps', 'Right_Triceps'],
    'Left Forearm': ['Left_Forearm'],
    'Right Forearm': ['Right_Forearm'],
    'Left Hand': ['Left_Hand'],
    'Right Hand': ['Right_Hand'],
    'Upper Chest': ['Upper_Chest', 'Upper_Trunk'],
    'Lower Chest': ['Lower_Chest', 'Lower_Trunk'],
    'Pelvis': ['Pelvis', 'Hip_Flexors'],
    'Left Thigh': ['Left_Thigh', 'Left_Quadriceps', 'Left_Hamstrings'],
    'Right Thigh': ['Right_Thigh', 'Right_Quadriceps', 'Right_Hamstrings'],
    'Left Lower Leg': ['Left_Lower_Leg', 'Left_Knee'],
    'Right Lower Leg': ['Right_Lower_Leg', 'Right_Knee'],
    'Left Foot': ['Left_Foot', 'Left_Ankle'],
    'Right Foot': ['Right_Foot', 'Right_Ankle']
  };

  // Get exact keys to search for this segment
  const searchKeys = segmentMap[segment.label] || [segment.label.replace(' ', '_')];

  // Look for exact matches in MMT data
  const segmentEntries = Object.entries(mmtData || {}).filter(([key]) =>
    searchKeys.includes(key)
  );

  console.log(`MMT lookup for ${segment.label} using keys: ${searchKeys}:`, segmentEntries);

  if (segmentEntries.length === 0) return '5';

  // Find the lowest (worst) grade
  const lowestScore = segmentEntries.reduce((lowest, [_, data]) => {
    if (!data?.score) return lowest;
    const currentScore = parseInt(data.score);
    const lowestValue = parseInt(lowest);
    return isNaN(currentScore) ? lowest :
           currentScore < lowestValue ? data.score : lowest;
  }, '5');

  console.log(`Segment ${segment.label} lowest MMT grade:`, lowestScore);
  return lowestScore;
};

export const getJointColor = (jointRom: string) => {
  const color = (() => {
    switch (jointRom) {
      case 'WFL': 
        return "fill-green-200 stroke-green-600 stroke-2";
      case '3/4':
        return "fill-blue-200 stroke-blue-600 stroke-2";
      case '1/2':
        return "fill-yellow-200 stroke-yellow-600 stroke-2";
      case '1/4':
        return "fill-orange-200 stroke-orange-600 stroke-2";
      case 'nominal':
        return "fill-red-200 stroke-red-600 stroke-2";
      default:
        return "fill-green-200 stroke-green-600 stroke-2";
    }
  })();
  console.log('Joint ROM:', jointRom, 'Color:', color);
  return color;
};

export const getSegmentColor = (mmt: string) => {
  const grade = parseInt(mmt);
  switch (grade) {
    case 5: return "fill-green-200 hover:fill-green-300";
    case 4: return "fill-blue-200 hover:fill-blue-300";
    case 3: return "fill-yellow-200 hover:fill-yellow-300";
    case 2: return "fill-orange-200 hover:fill-orange-300";
    case 1: return "fill-red-200 hover:fill-red-300";
    case 0: return "fill-red-400 hover:fill-red-500";
    default: return "fill-green-200 hover:fill-green-300";
  }
};