import { AssessmentData } from '../../../types/assessment';

export const transformFormToAssessment = (formData: any): AssessmentData => {
  // Transform the form data to match the assessment structure
  return {
    metadata: {
      version: "1.0",
      exportDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      exportType: "final"
    },
    assessment: {
      demographics: {
        firstName: formData.demographics?.firstName || '',
        lastName: formData.demographics?.lastName || '',
        dateOfBirth: formData.demographics?.dateOfBirth || '',
        gender: formData.demographics?.gender || '',
        phone: formData.demographics?.phone || '',
        email: formData.demographics?.email || '',
        address: formData.demographics?.address || '',
        maritalStatus: formData.demographics?.maritalStatus || '',
        emergencyContact: formData.demographics?.emergencyContact || {
          name: '',
          phone: '',
          relationship: ''
        },
        numberOfChildren: formData.demographics?.numberOfChildren || 0,
        childrenDetails: formData.demographics?.childrenDetails || '',
        householdMembers: formData.demographics?.householdMembers || []
      },
      documentation: {
        medicalDocumentation: [],
        legalDocumentation: []
      },
      medicalHistory: {
        medications: formData.medicalHistory?.medications || [],
        allergies: formData.medicalHistory?.allergies || [],
        treatments: formData.medicalHistory?.treatments || [],
        injury: formData.medicalHistory?.injury || {},
        currentTreatment: formData.medicalHistory?.currentTreatment || [],
        preExisting: formData.medicalHistory?.preExisting || '',
        familyHistory: formData.medicalHistory?.familyHistory || ''
      },
      typicalDay: {
        preAccident: formData.typicalDay?.preAccident || {
          daily: { 
            sleepSchedule: {},
            routines: {
              morning: {},
              afternoon: {},
              evening: {},
              night: {}
            }
          },
          weekly: {}
        },
        current: formData.typicalDay?.current || {
          daily: {
            sleepSchedule: {},
            routines: {
              morning: {},
              afternoon: {},
              evening: {},
              night: {}
            }
          },
          weekly: {}
        }
      },
      functionalAssessment: {
        rangeOfMotion: {
          measurements: formData.functionalAssessment?.rangeOfMotion?.measurements || [],
          generalNotes: formData.functionalAssessment?.rangeOfMotion?.generalNotes || ''
        },
        manualMuscleTesting: {
          grades: formData.functionalAssessment?.manualMuscleTesting?.grades || {},
          generalNotes: formData.functionalAssessment?.manualMuscleTesting?.generalNotes || ''
        },
        bergBalance: {
          items: formData.functionalAssessment?.bergBalance?.items || {},
          totalScore: formData.functionalAssessment?.bergBalance?.totalScore || 0,
          generalNotes: formData.functionalAssessment?.bergBalance?.generalNotes || ''
        },
        posturalTolerances: formData.functionalAssessment?.posturalTolerances || {},
        transfers: formData.functionalAssessment?.transfers || {}
      },
      symptoms: {
        physical: formData.symptoms?.physical || [],
        cognitive: formData.symptoms?.cognitive || [],
        emotional: formData.symptoms?.emotional || [],
        generalNotes: formData.symptoms?.generalNotes || ''
      },
      environmental: {
        propertyOverview: {
          recommendedModifications: formData.environmental?.propertyOverview?.recommendedModifications || [],
          identifiedHazards: formData.environmental?.propertyOverview?.identifiedHazards || [],
          rooms: formData.environmental?.propertyOverview?.rooms || {}
        },
        exterior: formData.environmental?.exterior || [],
        safety: {
          hazards: formData.environmental?.safety?.hazards || [],
          recommendations: formData.environmental?.safety?.recommendations || []
        }
      },
      adl: {
        basic: {
          bathing: formData.adl?.basic?.bathing || {},
          dressing: formData.adl?.basic?.dressing || {},
          feeding: formData.adl?.basic?.feeding || {},
          transfers: formData.adl?.basic?.transfers || {}
        },
        iadl: {
          household: formData.adl?.iadl?.household || {},
          community: formData.adl?.iadl?.community || {}
        },
        work: {
          status: formData.adl?.work?.status || {}
        }
      },
      care: {
        personalCare: formData.care?.personalCare || {}
      },
      amaGuides: {
        narrative: formData.amaGuides?.narrative || ''
      }
    }
  };
};

export const validateFormData = (formData: any): string[] => {
  const errors: string[] = [];
  
  // Required demographics
  if (!formData.demographics?.firstName) errors.push('First name is required');
  if (!formData.demographics?.lastName) errors.push('Last name is required');
  if (!formData.demographics?.dateOfBirth) errors.push('Date of birth is required');
  
  // Required medical history
  if (!formData.medicalHistory?.injury?.circumstance) {
    errors.push('Injury circumstance is required');
  }
  
  // Required assessments
  if (!formData.functionalAssessment?.rangeOfMotion?.measurements?.length) {
    errors.push('ROM measurements are required');
  }
  
  if (!Object.keys(formData.functionalAssessment?.manualMuscleTesting?.grades || {}).length) {
    errors.push('MMT grades are required');
  }
  
  return errors;
};

export const getCompletionStatus = (formData: any): Record<string, boolean> => {
  return {
    demographics: Boolean(
      formData.demographics?.firstName &&
      formData.demographics?.lastName &&
      formData.demographics?.dateOfBirth
    ),
    medicalHistory: Boolean(
      formData.medicalHistory?.injury?.circumstance &&
      formData.medicalHistory?.currentTreatment?.length
    ),
    functionalAssessment: Boolean(
      formData.functionalAssessment?.rangeOfMotion?.measurements?.length &&
      Object.keys(formData.functionalAssessment?.manualMuscleTesting?.grades || {}).length
    ),
    symptoms: Boolean(
      formData.symptoms?.physical?.length ||
      formData.symptoms?.cognitive?.length ||
      formData.symptoms?.emotional?.length
    ),
    adl: Boolean(
      Object.keys(formData.adl?.basic || {}).length &&
      Object.keys(formData.adl?.iadl || {}).length
    )
  };
};