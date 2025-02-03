export interface OTReport {
  metadata: {
    assessor: {
      name: string;
      credentials: string;
      experience: string;
      qualifications: string[];
    };
    assessment: {
      date: string;
      reportDate: string;
      location: string;
    };
    client: {
      demographics: ClientDemographics;
      referralInfo: ReferralInformation;
    };
    documentation: {
      reviewed: DocumentationReviewed[];
    };
  };
  
  clinicalHistory: {
    preAccident: {
      medicalHistory: string[];
      functionalStatus: string;
      employment: Employment;
      activities: string[];
    };
    accident: {
      date: string;
      mechanism: string;
      immediateResponse: string;
      initialTreatment: string;
      subsequentCare: string[];
    };
    postAccident: {
      courseOfRecovery: string;
      currentTreatment: Treatment[];
      medications: Medication[];
    };
  };

  functionalAssessment: {
    subjective: {
      reportedSymptoms: Symptom[];
      managementStrategies: string[];
      perceivedLimitations: string[];
    };
    objective: {
      rangeOfMotion: ROMAssessment[];
      strength: StrengthAssessment[];
      balance: BalanceAssessment;
      tolerances: PosturalTolerances;
      transfers: TransferAssessment[];
    };
    environmental: {
      home: EnvironmentalAssessment;
      community: CommunityAccess;
      workplace?: WorkplaceAssessment;
    };
    adl: {
      selfCare: ADLAssessment[];
      homeManagement: ADLAssessment[];
      leisure: ADLAssessment[];
    };
    behavioural: {
      emotional: string;
      cognitive: string;
      social: string;
    };
  };

  amaAnalysis: {
    activities: AMASphereDomain;
    social: AMASphereDomain;
    concentration: AMASphereDomain;
    adaptation: AMASphereDomain;
  };

  recommendations: {
    rehabilitation: string[];
    equipment: string[];
    homeModifications: string[];
    support: string[];
    followUp: string[];
  };
}