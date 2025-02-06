export interface PropertyAccess {
  entranceType: string;
  numberOfSteps: number;
  hasRailing: boolean;
  notes: string;
}

export interface PropertyOverview {
  type: string;
  layout: string;
  access: {
    exterior: PropertyAccess;
    interior: PropertyAccess & {
      hasStairs: boolean;
      numberOfStairs: number;
    };
  };
  generalCondition: string;
  primaryConcerns: string[];
}

export interface RoomBase {
  layout: string;
  dimensions: string;
  flooring: {
    type: string;
    condition: string;
    slipResistant: boolean;
    notes?: string;
  };
  modifications: {
    required: string[];
  };
}

export interface RoomAssessment {
  kitchen: RoomBase & {
    storage: {
      upperCabinets: {
        accessible: boolean;
        height: string;
        notes: string;
      };
      lowerCabinets: {
        accessible: boolean;
        type: string;
        notes: string;
      };
    };
    workspaces: {
      counterHeight: string;
      adequateSpace: boolean;
      seatingAvailable: boolean;
      notes: string;
    };
    appliances: {
      stove: {
        type: string;
        controls: string;
        accessible: boolean;
      };
      refrigerator: {
        type: string;
        accessible: boolean;
        notes: string;
      };
      microwave: {
        mounted: string;
        accessible: boolean;
        notes: string;
      };
    };
  };
  bathroom_main: RoomBase & {
    fixtures: {
      toilet: {
        height: string;
        spaceAround: string;
        hasGrabBars: boolean;
      };
      shower: {
        type: string;
        hasGrabBars: boolean;
        hasSeat: boolean;
        hasHandheld: boolean;
      };
      sink: {
        height: string;
        clearanceUnder: boolean;
        faucetType: string;
      };
    };
    storage: {
      accessible: boolean;
      adequate: boolean;
      notes: string;
    };
  };
  bedroom_main: RoomBase & {
    bed: {
      type: string;
      height: string;
      accessibleFrom: string;
      transferDevices: boolean;
    };
    storage: {
      closet: {
        type: string;
        accessible: boolean;
        notes: string;
      };
      dresser: {
        height: string;
        accessible: boolean;
      };
    };
    lighting: {
      adequate: boolean;
      controls: string;
      notes: string;
    };
  };
}

export interface SafetyAssessment {
  general: {
    lighting: {
      adequate: boolean;
      concerns: string[];
    };
    electricalOutlets: {
      accessible: boolean;
      adequate: boolean;
      notes: string;
    };
    flooring: {
      concerns: string[];
    };
    emergencyAccess: {
      exitPlans: string;
      concerns: string[];
    };
  };
  risks: {
    falls: {
      level: string;
      factors: string[];
    };
    fire: {
      level: string;
      factors: string[];
    };
  };
  modifications: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  recommendations: {
    equipment: string[];
    services: string[];
    monitoring: string;
  };
}

export interface EnvironmentalAssessment {
  propertyOverview: PropertyOverview;
  roomAssessment: RoomAssessment;
  safetyAssessment: SafetyAssessment;
}