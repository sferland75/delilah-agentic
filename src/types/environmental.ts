export interface PropertyAccess {
  description: string;
}

export interface PropertyOverview {
  propertyType: string;
  layoutDescription: string;
  access: {
    exterior: PropertyAccess;
    interior: PropertyAccess & {
      hasStairs?: boolean;
      numberOfStairs?: number;
    };
  };
  recommendedModifications: string[];
  identifiedHazards: string[];
}

export interface Safety {
  hazards: string[];
  concerns: string;
  recommendations: string;
}

export interface EnvironmentalSection {
  propertyOverview: PropertyOverview;
  safety: Safety;
}
