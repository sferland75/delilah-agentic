export interface FunctionalAssessment {
  tolerances: {
    [activity: string]: {
      level: 'independent' | 'modified_independent' | 'supervision' | 'minimal_assist' | 'moderate_assist' | 'maximal_assist' | 'dependent';
      duration: string;
      frequency: string;
      painLevel: number;
      observations: string;
    };
  };
  rangeOfMotion: {
    [joint: string]: {
      [movement: string]: {
        active: number;
        passive: number;
        observations: string;
      };
    };
  };
  strength: {
    [region: string]: {
      [muscle: string]: {
        left: string;
        right: string;
        observations: string;
      };
    };
  };
}