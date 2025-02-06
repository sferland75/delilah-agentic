export const mockEnvironmentalData = {
  propertyOverview: {
    propertyType: 'Single Family Home',
    layoutDescription: 'Single story ranch-style home with open floor plan. All living areas on ground level.',
    access: {
      exterior: { 
        description: 'Level driveway with concrete walkway to entrance. Well-lit with motion sensors. No steps to entrance.' 
      },
      interior: {
        description: 'Wide hallways (36"+), standard doorways (32-34"). No interior stairs. Open floor plan with good clearance.',
        hasStairs: false,
        numberOfStairs: 0
      }
    },
    recommendedModifications: [
      'Install grab bars in bathroom',
      'Add anti-slip mats in bathroom',
      'Consider raised toilet seat',
      'Install handrails in hallway'
    ],
    identifiedHazards: [
      'Throw rugs in living room could be trip hazard',
      'Shower threshold requires stepping over',
      'Limited lighting in hallway at night'
    ]
  },
  safety: {
    hazards: [
      'Uneven Surfaces',
      'Poor Lighting',
      'Limited Accessibility'
    ],
    concerns: 'Client reports difficulty accessing shower and toilet. Nighttime navigation in hallways poses increased fall risk due to limited lighting. Some throw rugs present trip hazards.',
    recommendations: 'Immediate recommendations include removing or securing throw rugs, installing motion-activated night lights in hallways, and adding grab bars in bathroom. Consider installing handrails in main hallway and raised toilet seat for improved safety and independence.'
  }
};

export default mockEnvironmentalData;