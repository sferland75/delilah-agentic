import { OTReport } from './schemas/ot-report-schema';
import { formatDate, extractProviderType } from './utils/transformations';

export class AssessmentMapper {
  static mapAssessmentToReport(assessmentData: any): OTReport {
    const assessment = assessmentData.assessment;

    return {
      metadata: {
        assessor: {
          name: "Sebastien Ferland",
          credentials: "OT Reg.(Ont)",
          experience: "over 25 years",
          qualifications: [
            "Graduated from the University of Ottawa's School of Rehabilitation in 1998",
            "Extensive experience in automobile insurance sector, personal injury and family law",
            "Regular contributor to catastrophic designation assessment teams"
          ]
        },
        assessment: {
          date: formatDate(assessment.metadata?.exportDate),
          reportDate: formatDate(new Date().toISOString()),
          location: assessment.demographics?.address
        },
        client: {
          demographics: this.mapDemographics(assessment.demographics),
          referralInfo: {}
        },
        documentation: {
          reviewed: this.mapDocumentation(assessmentData)
        }
      },
      clinicalHistory: this.mapClinicalHistory(assessment),
      functionalAssessment: this.mapFunctionalAssessment(assessment),
      amaAnalysis: this.mapAMAAnalysis(assessment),
      recommendations: {
        rehabilitation: [],
        equipment: [],
        homeModifications: [],
        support: [],
        followUp: []
      }
    };
  }

  private static mapDemographics(demographics: any) {
    if (!demographics) return {} as any;
    
    return {
      firstName: demographics.firstName || "",
      lastName: demographics.lastName || "",
      dateOfBirth: formatDate(demographics.dateOfBirth) || "",
      gender: demographics.gender || "",
      phone: demographics.phone || "",
      address: demographics.address || "",
      maritalStatus: demographics.maritalStatus || "",
      children: demographics.numberOfChildren || 0,
      childrenDetails: demographics.childrenDetails || "",
      householdMembers: demographics.householdMembers || []
    };
  }

  private static mapDocumentation(data: any) {
    // Implementation would go here to map documentation
    return [];
  }

  private static mapClinicalHistory(data: any) {
    const medicalHistory = data.medicalHistory || {};
    
    return {
      preAccident: {
        medicalHistory: [medicalHistory.preExisting || ""],
        functionalStatus: "",
        employment: this.mapEmployment(data),
        activities: []
      },
      accident: {
        date: formatDate(data.metadata?.exportDate),
        mechanism: medicalHistory.injury?.circumstance || "",
        immediateResponse: medicalHistory.injury?.immediateResponse || "",
        initialTreatment: medicalHistory.injury?.subsequentCare || "",
        subsequentCare: []
      },
      postAccident: {
        courseOfRecovery: "",
        currentTreatment: (medicalHistory.currentTreatment || []).map((t: any) => ({
          provider: t.name,
          type: extractProviderType(t),
          frequency: t.frequency,
          startDate: formatDate(t.startDate),
          focus: t.focus,
          progress: t.progress
        })),
        medications: (medicalHistory.medications || []).map((m: any) => ({
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          purpose: m.purpose
        }))
      }
    };
  }

  private static mapFunctionalAssessment(data: any) {
    return {
      subjective: {
        reportedSymptoms: [
          ...this.mapSymptoms(data.symptoms?.physical || [], 'physical'),
          ...this.mapSymptoms(data.symptoms?.cognitive || [], 'cognitive'),
          ...this.mapSymptoms(data.symptoms?.emotional || [], 'emotional')
        ],
        managementStrategies: [],
        perceivedLimitations: []
      },
      objective: {
        rangeOfMotion: this.mapRangeOfMotion(data.functionalAssessment?.rangeOfMotion),
        strength: this.mapStrength(data.functionalAssessment?.manualMuscleTesting),
        balance: this.mapBalance(data.functionalAssessment?.bergBalance),
        tolerances: {
          sitting: "",
          standing: "",
          walking: "",
          lifting: "",
          carrying: "",
          notes: ""
        },
        transfers: []
      },
      environmental: {
        home: {
          type: "",
          layout: "",
          barriers: [],
          adaptations: [],
          hazards: []
        },
        community: {
          transportation: "",
          shopping: "",
          recreation: "",
          barriers: []
        }
      },
      adl: {
        selfCare: [],
        homeManagement: [],
        leisure: []
      },
      behavioural: {
        emotional: "",
        cognitive: "",
        social: ""
      }
    };
  }

  private static mapAMAAnalysis(_data: any) {
    return {
      activities: this.createEmptyAMADomain(),
      social: this.createEmptyAMADomain(),
      concentration: this.createEmptyAMADomain(),
      adaptation: this.createEmptyAMADomain()
    };
  }

  private static createEmptyAMADomain() {
    return {
      description: "",
      preAccidentStatus: "",
      currentStatus: "",
      impairments: [],
      evidence: []
    };
  }

  private static mapEmployment(_data: any) {
    return {
      status: "",
      employer: "",
      role: "",
      duties: [],
      schedule: ""
    };
  }

  private static mapSymptoms(symptoms: any[], type: 'physical' | 'cognitive' | 'emotional') {
    return symptoms.map(s => ({
      type,
      description: s.location || s.symptom || "",
      severity: s.severity || "",
      frequency: s.frequency || "",
      aggravating: [s.aggravating || ""],
      relieving: [s.relieving || ""],
      impact: s.impact || ""
    }));
  }

  private static mapRangeOfMotion(rom: any) {
    if (!rom?.measurements) return [];
    
    return rom.measurements.map((m: any) => ({
      joint: m.joint || "",
      movement: m.movement || "",
      normalRange: m.normalROM || "",
      left: m.left,
      right: m.right,
      pain: m.painLeft || m.painRight || false,
      notes: m.notes || ""
    }));
  }

  private static mapStrength(mmt: any) {
    if (!mmt?.grades) return [];
    
    const results: any[] = [];
    const grades = mmt.grades || {};
    
    Object.entries(grades).forEach(([joint, muscles]: [string, any]) => {
      Object.entries(muscles).forEach(([muscle, movements]: [string, any]) => {
        Object.entries(movements).forEach(([movement, sides]: [string, any]) => {
          results.push({
            muscle: `${joint} ${muscle} ${movement}`,
            left: sides.left || "",
            right: sides.right || "",
            notes: ""
          });
        });
      });
    });
    
    return results;
  }

  private static mapBalance(berg: any) {
    if (!berg) return {
      staticStanding: "",
      dynamicStanding: "",
      singleLegStance: "",
      functionalReach: "",
      gait: "",
      falls: [],
      notes: berg?.generalNotes || ""
    };

    return {
      staticStanding: berg.items?.standingUnsupported?.notes || "",
      dynamicStanding: berg.items?.turn360?.notes || "",
      singleLegStance: berg.items?.standingOnOneLeg?.notes || "",
      functionalReach: berg.items?.reachingForward?.notes || "",
      gait: "",
      falls: [],
      notes: berg.generalNotes || ""
    };
  }
}