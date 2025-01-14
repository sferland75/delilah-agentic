import { MUSCLE_GROUPS } from './muscle-groups';

// Helper function to create a default grade object with normal values
const createDefaultGrade = () => ({
  left: 5,  // Normal strength
  right: 5, // Normal strength
  leftPain: false,
  rightPain: false,
  notes: 'No identified limitations.'
});

// Create default values for all muscle groups
export const DEFAULT_MMT_VALUES = {
  grades: Object.entries(MUSCLE_GROUPS).reduce((acc, [extremity, regions]) => {
    regions.forEach(group => {
      if (!acc[group.region]) {
        acc[group.region] = {};
      }
      
      group.muscles.forEach(muscle => {
        if (!acc[group.region][muscle.name]) {
          acc[group.region][muscle.name] = {};
        }
        
        muscle.movements.forEach(movement => {
          acc[group.region][muscle.name][movement] = createDefaultGrade();
        });
      });
    });
    return acc;
  }, {}),
  generalNotes: ''
};