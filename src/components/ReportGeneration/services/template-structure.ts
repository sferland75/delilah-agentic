import { AssessmentData } from '../types';

export const REPORT_SECTIONS = {
  // Section 1: Introduction & Demographics
  introduction: {
    order: 1,
    title: 'OCCUPATIONAL THERAPY EVALUATION',
    subsections: {
      assessmentInfo: {
        order: 1,
        required: true,
        dataPath: ['metadata', 'demographics'],
        fields: [
          'clientName',
          'fileNumber',
          'dateOfAccident',
          'dateOfBirth',
          'interpreter',
          'language'
        ]
      },
      situationalAssessment: {
        order: 2,
        required: true,
        dataPath: ['assessment', 'metadata'],
        fields: [
          'location',
          'date',
          'duration',
          'presentIndividuals'
        ]
      },
      inHomeAssessment: {
        order: 3,
        required: true,
        dataPath: ['assessment', 'metadata'],
        fields: [
          'location',
          'date',
          'duration',
          'presentIndividuals'
        ]
      }
    }
  },

  // Section 2: Purpose & Methodology 
  purposeAndMethodology: {
    order: 2,
    subsections: {
      purpose: {
        order: 1,
        required: true,
        dataPath: ['assessment', 'purpose']
      },
      informedConsent: {
        order: 2,
        required: true
      },
      methodology: {
        order: 3,
        required: true,
        dataPath: ['assessment', 'methodology']
      }
    }
  },

  // Section 3: Pre-Accident History & Daily Routine
  preAccidentStatus: {
    order: 3,
    subsections: {
      medicalHistory: {
        order: 1,
        required: true,
        dataPath: ['assessment', 'medicalHistory', 'preExisting']
      },
      dailyRoutine: {
        order: 2,
        required: true,
        dataPath: ['assessment', 'typicalDay', 'preAccident']
      }
    }
  },

  // Section 4: Mechanism of Injury & Course of Recovery
  injuryAndRecovery: {
    order: 4,
    subsections: {
      mechanism: {
        order: 1,
        required: true,
        dataPath: ['assessment', 'medicalHistory', 'injury']
      },
      natureOfInjury: {
        order: 2,
        required: true,
        dataPath: ['assessment', 'medicalHistory', 'injury']
      },
      courseOfRecovery: {
        order: 3,
        required: true,
        dataPath: [
          'assessment',
          'medicalHistory',
          'currentTreatment'
        ]
      }
    }
  },

  // Section 5: Current Medical/Rehabilitation Team
  currentTeam: {
    order: 5,
    required: true,
    dataPath: ['assessment', 'medicalHistory', 'currentTreatment']
  },

  // Section 6: Medications
  medications: {
    order: 6,
    required: true,
    dataPath: ['assessment', 'medicalHistory', 'medications']
  },

  // Section 7: Subjective Information
  subjectiveInformation: {
    order: 7,
    subsections: {
      physicalSymptoms: {
        order: 1,
        required: true,
        dataPath: ['assessment', 'symptoms', 'physical']
      },
      cognitiveEmotionalSymptoms: {
        order: 2,
        required: true,
        dataPath: [
          'assessment', 
          'symptoms',
          ['cognitive', 'emotional']
        ]
      },
      symptomManagement: {
        order: 3,
        required: true,
        dataPath: ['assessment', 'symptoms', 'generalNotes']
      }
    }
  },

  // Section 8: Functional Assessment
  functionalAssessment: {
    order: 8,
    subsections: {
      tolerances: {
        order: 1,
        required: true,
        dataPath: ['assessment', 'functionalAssessment', 'posturalTolerances']
      },
      mobility: {
        order: 2,
        required: true,
        dataPath: ['assessment', 'functionalAssessment', 'transfers']
      },
      rangeOfMotion: {
        order: 3,
        required: true,
        dataPath: ['assessment', 'functionalAssessment', 'rangeOfMotion']
      },
      emotionalCognitive: {
        order: 4,
        required: true,
        dataPath: ['assessment', 'symptoms', ['cognitive', 'emotional']]
      }
    }
  },

  // Section 9: Current Daily Routine
  currentDailyRoutine: {
    order: 9,
    required: true,
    dataPath: ['assessment', 'typicalDay', 'current']
  },

  // Section 10: Environmental Assessment
  environmentalAssessment: {
    order: 10,
    required: true,
    dataPath: ['assessment', 'environmental']
  },

  // Section 11: Living Arrangements & Social Status
  livingArrangements: {
    order: 11,
    required: true,
    dataPath: ['assessment', 'demographics', 'householdMembers']
  },

  // Section 12: Activities of Daily Living
  activitiesOfDailyLiving: {
    order: 12,
    subsections: {
      selfCare: {
        order: 1,
        required: true,
        dataPath: ['assessment', 'adl', 'basic']
      },
      householdManagement: {
        order: 2,
        required: true,
        dataPath: ['assessment', 'adl', 'iadl']
      },
      financialManagement: {
        order: 3,
        required: true,
        dataPath: ['assessment', 'adl', 'iadl']
      },
      communityAccess: {
        order: 4,
        required: true,
        dataPath: ['assessment', 'adl', 'iadl']
      },
      caregiving: {
        order: 5,
        required: true,
        dataPath: ['assessment', 'adl', 'iadl']
      },
      vocational: {
        order: 6,
        required: true,
        dataPath: ['assessment', 'adl', 'work']
      }
    }
  },

  // Section 13: Attendant Care Assessment
  attendantCare: {
    order: 13,
    required: true,
    dataPath: ['assessment', 'care']
  },

  // Section 14: Situational Assessment
  situationalAssessment: {
    order: 14,
    required: true
  },

  // Section 15: AMA Guides Assessment
  amaGuidesAssessment: {
    order: 15,
    subsections: {
      activitiesOfDailyLiving: {
        order: 1,
        required: true,
        dataPath: ['assessment', 'amaGuides', 'activities']
      },
      socialFunctioning: {
        order: 2,
        required: true,
        dataPath: ['assessment', 'amaGuides', 'social']
      },
      concentrationPersistencePace: {
        order: 3,
        required: true,
        dataPath: ['assessment', 'amaGuides', 'concentration']
      },
      adaptation: {
        order: 4,
        required: true,
        dataPath: ['assessment', 'amaGuides', 'workAdaptation']
      }
    }
  }
};

// Helper function to get ordered sections
export const getOrderedSections = () => {
  return Object.entries(REPORT_SECTIONS)
    .sort(([,a], [,b]) => a.order - b.order)
    .map(([key]) => key);
};

// Helper function to validate required fields
export const validateSection = (
  section: string,
  data: AssessmentData
): boolean => {
  const sectionConfig = REPORT_SECTIONS[section];
  if (!sectionConfig.required) return true;

  if (sectionConfig.dataPath) {
    let currentData = data;
    for (const path of sectionConfig.dataPath) {
      if (Array.isArray(path)) {
        // Handle array of alternative paths
        const hasValidPath = path.some(p => currentData?.[p]);
        if (!hasValidPath) return false;
      } else {
        currentData = currentData?.[path];
        if (!currentData) return false;
      }
    }
  }

  if (sectionConfig.subsections) {
    return Object.keys(sectionConfig.subsections).every(
      subsection => validateSection(subsection, data)
    );
  }

  return true;
};

// Helper function to extract section data
export const extractSectionData = (
  section: string,
  data: AssessmentData
) => {
  const sectionConfig = REPORT_SECTIONS[section];
  if (!sectionConfig.dataPath) return null;

  let extractedData = data;
  for (const path of sectionConfig.dataPath) {
    if (Array.isArray(path)) {
      // Handle array of alternative paths
      extractedData = path.reduce((acc, p) => ({
        ...acc,
        [p]: extractedData?.[p]
      }), {});
    } else {
      extractedData = extractedData?.[path];
    }
  }

  return extractedData;
};