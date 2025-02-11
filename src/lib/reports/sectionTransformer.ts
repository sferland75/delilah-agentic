import { Assessment } from '@/types/assessment';
import { formatDate, formatList, formatScore } from './reportUtils';

export interface TransformedSection {
  title: string;
  content: string;
  subsections: Record<string, string>;
  metadata?: Record<string, any>;
}

export class SectionTransformer {
  private assessment: Assessment;

  constructor(assessment: Assessment) {
    this.assessment = assessment;
  }

  private transformDemographics(): TransformedSection {
    const { demographics, assessment: assessmentInfo } = this.assessment.initial || {};
    
    return {
      title: 'Demographics & Background',
      content: `
CLIENT INFORMATION
Name: ${demographics?.firstName} ${demographics?.lastName}
Date of Birth: ${formatDate(demographics?.dateOfBirth || '')}
Address: ${demographics?.streetAddress}
         ${demographics?.city}, ${demographics?.postalCode}
Phone: ${demographics?.phone}
Email: ${demographics?.email}

ASSESSMENT DETAILS
Date of Assessment: ${formatDate(assessmentInfo?.date || '')}
Location: ${assessmentInfo?.location || 'Not specified'}
Duration: ${assessmentInfo?.duration || 'Not specified'}
Referral Source: ${assessmentInfo?.referralSource || 'Not specified'}

FILE INFORMATION
Claim Number: ${assessmentInfo?.claimNumber || 'Not specified'}
Insurance Company: ${assessmentInfo?.insuranceCompany || 'Not specified'}
Date of Loss: ${formatDate(assessmentInfo?.dateOfLoss || '')}
      `.trim(),
      subsections: {
        personal: 'Client demographics and contact information',
        assessment: 'Assessment timing and location details',
        fileInfo: 'Claim and insurance information'
      }
    };
  }

  private transformMethodology(): TransformedSection {
    const { methodology, consent } = this.assessment.initial || {};
    
    return {
      title: 'Purpose & Methodology',
      content: `
PURPOSE OF ASSESSMENT
${methodology?.purpose || 'Assessment purpose not specified'}

INFORMED CONSENT
${consent?.details || 'Consent details not recorded'}
Consent Obtained: ${consent?.obtained ? 'Yes' : 'No'}
${consent?.notes ? `Additional Notes: ${consent.notes}` : ''}

METHODOLOGY
The following assessment methods were employed:
${formatList(methodology?.methods || [])}

DOCUMENTATION REVIEWED
${formatList(methodology?.documentsReviewed || [])}
      `.trim(),
      subsections: {
        purpose: 'Assessment purpose and scope',
        consent: 'Informed consent details',
        methodology: 'Assessment methods used',
        documentation: 'Documents reviewed'
      }
    };
  }

  private transformMedicalHistory(): TransformedSection {
    const { medical } = this.assessment;
    const { injury, treatments, medications } = medical || {};

    return {
      title: 'Medical History',
      content: `
PRE-ACCIDENT HISTORY
${medical?.preAccidentHistory || 'No pre-accident history recorded'}

INJURY DETAILS
Date of Injury: ${formatDate(injury?.date || '')}
Mechanism: ${injury?.circumstance || 'Not specified'}
Description: ${injury?.description || 'Not specified'}

CURRENT TREATMENT TEAM
${treatments?.map(t => 
  `• ${t.providerName} (${t.profession})
     Frequency: ${t.frequency}
     Focus: ${t.focus}`
).join('\n') || 'No current treatments recorded'}

MEDICATIONS
${medications?.map(m => 
  `• ${m.name} ${m.dosage}
     Frequency: ${m.frequency}
     Purpose: ${m.purpose}`
).join('\n') || 'No medications recorded'}
      `.trim(),
      subsections: {
        preAccident: 'Pre-accident medical history',
        injury: 'Injury details and mechanism',
        treatment: 'Current treatment providers',
        medications: 'Current medications'
      }
    };
  }

  private transformSubjective(): TransformedSection {
    const { symptoms } = this.assessment;
    
    return {
      title: 'Subjective Information',
      content: `
PHYSICAL SYMPTOMS
${symptoms?.physical.map(s => 
  `• ${s.location}: ${s.description}
     Severity: ${s.severity}
     Frequency: ${s.frequency}
     Aggravating Factors: ${s.aggravating}
     Alleviating Factors: ${s.alleviating}`
).join('\n') || 'No physical symptoms recorded'}

COGNITIVE SYMPTOMS
${symptoms?.cognitive.map(s => 
  `• ${s.description}
     Impact: ${s.impact}
     Management: ${s.management}`
).join('\n') || 'No cognitive symptoms recorded'}

EMOTIONAL SYMPTOMS
${symptoms?.emotional.map(s => 
  `• ${s.description}
     Impact: ${s.impact}
     Management: ${s.management}`
).join('\n') || 'No emotional symptoms recorded'}

SYMPTOM MANAGEMENT
${symptoms?.management || 'No symptom management strategies recorded'}
      `.trim(),
      subsections: {
        physical: 'Physical symptoms and pain',
        cognitive: 'Cognitive symptoms and impacts',
        emotional: 'Emotional symptoms and impacts',
        management: 'Symptom management strategies'
      }
    };
  }

  private transformFunctional(): TransformedSection {
    const { functional } = this.assessment;
    
    return {
      title: 'Functional Assessment',
      content: `
PHYSICAL TOLERANCES
Standing: ${functional?.tolerances?.standing || 'Not assessed'}
Walking: ${functional?.tolerances?.walking || 'Not assessed'}
Sitting: ${functional?.tolerances?.sitting || 'Not assessed'}

MOBILITY
Gait: ${functional?.mobility?.gait || 'Not assessed'}
Balance: ${functional?.mobility?.balance || 'Not assessed'}
Stairs: ${functional?.mobility?.stairs || 'Not assessed'}

TRANSFERS
Bed: ${functional?.transfers?.bed || 'Not assessed'}
Chair: ${functional?.transfers?.chair || 'Not assessed'}
Vehicle: ${functional?.transfers?.vehicle || 'Not assessed'}

RANGE OF MOTION
${functional?.rangeOfMotion?.map(rom => 
  `${rom.joint}: ${rom.movement} - ${rom.range}°`
).join('\n') || 'Range of motion not assessed'}

STRENGTH
${functional?.strength?.map(strength => 
  `${strength.muscle}: ${strength.grade}/5`
).join('\n') || 'Strength not assessed'}

CLINICAL PRESENTATION
${functional?.presentation || 'Clinical presentation not documented'}
      `.trim(),
      subsections: {
        tolerances: 'Physical activity tolerances',
        mobility: 'Mobility status and safety',
        transfers: 'Transfer abilities',
        rom: 'Range of motion measurements',
        strength: 'Manual muscle testing',
        presentation: 'Overall clinical presentation'
      }
    };
  }

  private transformTypicalDay(): TransformedSection {
    const { typicalDay } = this.assessment;
    
    return {
      title: 'Typical Day',
      content: `
PRE-ACCIDENT ROUTINE
Morning:
${formatList(typicalDay?.preAccident?.morning || [])}

Afternoon:
${formatList(typicalDay?.preAccident?.afternoon || [])}

Evening:
${formatList(typicalDay?.preAccident?.evening || [])}

CURRENT ROUTINE
Morning:
${formatList(typicalDay?.current?.morning || [])}

Afternoon:
${formatList(typicalDay?.current?.afternoon || [])}

Evening:
${formatList(typicalDay?.current?.evening || [])}

COMPARATIVE ANALYSIS
${typicalDay?.comparison || 'Comparative analysis not documented'}
      `.trim(),
      subsections: {
        preAccident: 'Pre-accident daily routine',
        current: 'Current daily routine',
        comparison: 'Analysis of changes'
      }
    };
  }

  private transformEnvironmental(): TransformedSection {
    const { environmental } = this.assessment;
    
    return {
      title: 'Environmental Assessment',
      content: `
PROPERTY OVERVIEW
Type: ${environmental?.property?.type || 'Not specified'}
Access: ${environmental?.property?.access || 'Not specified'}
Layout: ${environmental?.property?.layout || 'Not specified'}

ROOM ANALYSIS
${environmental?.rooms?.map(room => 
  `${room.type}:
   Floor Covering: ${room.floorCovering}
   Furniture: ${room.furniture}
   Challenges: ${room.challenges}
   Recommendations: ${room.recommendations}`
).join('\n\n') || 'Room analysis not documented'}

SAFETY CONSIDERATIONS
Hazards Identified: ${formatList(environmental?.hazards || [])}
Recommendations: ${formatList(environmental?.recommendations || [])}
      `.trim(),
      subsections: {
        property: 'Property overview and access',
        rooms: 'Room-by-room analysis',
        safety: 'Safety concerns and recommendations'
      }
    };
  }

  private transformADL(): TransformedSection {
    const { adl, housekeeping } = this.assessment;
    
    return {
      title: 'Activities of Daily Living',
      content: `
SELF-CARE ACTIVITIES
${Object.entries(adl?.selfCare || {}).map(([activity, status]) =>
  `${activity}: ${status}`
).join('\n') || 'Self-care activities not assessed'}

HOUSEHOLD MANAGEMENT
${housekeeping?.tasks?.map(task => 
  `${task.name}: ${task.frequency} - ${task.independence}`
).join('\n') || 'Household tasks not assessed'}

COMMUNITY ACCESS
Transportation: ${adl?.community?.transportation || 'Not assessed'}
Shopping: ${adl?.community?.shopping || 'Not assessed'}
Banking: ${adl?.community?.banking || 'Not assessed'}

WORK STATUS
${adl?.work?.status || 'Work status not documented'}
Limitations: ${formatList(adl?.work?.limitations || [])}

SOCIAL/LEISURE ACTIVITIES
Pre-Accident: ${formatList(adl?.leisure?.preAccident || [])}
Current: ${formatList(adl?.leisure?.current || [])}
      `.trim(),
      subsections: {
        selfCare: 'Self-care abilities',
        household: 'Household management',
        community: 'Community access',
        work: 'Work status and limitations',
        leisure: 'Social and leisure activities'
      }
    };
  }

  private transformAttendantCare(): TransformedSection {
    const { attendantCare } = this.assessment;
    
    return {
      title: 'Attendant Care',
      content: `
LEVEL 1: ROUTINE PERSONAL CARE
${attendantCare?.level1?.tasks?.map(task => 
  `${task.name}: ${task.frequency} - ${task.time} minutes`
).join('\n') || 'Level 1 care not assessed'}
Total Level 1 Hours/Month: ${attendantCare?.level1?.totalHours || 0}

LEVEL 2: BASIC SUPERVISORY CARE
${attendantCare?.level2?.tasks?.map(task => 
  `${task.name}: ${task.frequency} - ${task.time} minutes`
).join('\n') || 'Level 2 care not assessed'}
Total Level 2 Hours/Month: ${attendantCare?.level2?.totalHours || 0}

LEVEL 3: COMPLEX HEALTH CARE
${attendantCare?.level3?.tasks?.map(task => 
  `${task.name}: ${task.frequency} - ${task.time} minutes`
).join('\n') || 'Level 3 care not assessed'}
Total Level 3 Hours/Month: ${attendantCare?.level3?.totalHours || 0}

CALCULATIONS
Total Monthly Hours: ${
  (attendantCare?.level1?.totalHours || 0) +
  (attendantCare?.level2?.totalHours || 0) +
  (attendantCare?.level3?.totalHours || 0)
}
      `.trim(),
      subsections: {
        routine: 'Level 1 routine care',
        supervision: 'Level 2 supervisory care',
        complex: 'Level 3 complex care',
        calculations: 'Care hour calculations'
      }
    };
  }

  private transformAMAGuides(): TransformedSection {
    const { amaGuides } = this.assessment;
    
    return {
      title: 'AMA Guides Assessment',
      content: `
ACTIVITIES OF DAILY LIVING
Score: ${formatScore(amaGuides?.adl?.score)}
Comments: ${amaGuides?.adl?.comments || 'No comments provided'}

SOCIAL FUNCTIONING
Score: ${formatScore(amaGuides?.social?.score)}
Comments: ${amaGuides?.social?.comments || 'No comments provided'}

CONCENTRATION, PERSISTENCE AND PACE
Score: ${formatScore(amaGuides?.concentration?.score)}
Comments: ${amaGuides?.concentration?.comments || 'No comments provided'}

ADAPTATION
Score: ${formatScore(amaGuides?.adaptation?.score)}
Comments: ${amaGuides?.adaptation?.comments || 'No comments provided'}

OVERALL IMPAIRMENT
Class: ${amaGuides?.overallClass || 'Not determined'}
Percentage: ${amaGuides?.percentage || 'Not calculated'}
      `.trim(),
      subsections: {
        adl: 'Activities of Daily Living impairment',
        social: 'Social Functioning impairment',
        concentration: 'Concentration/Persistence/Pace impairment',
        adaptation: 'Adaptation impairment'
      }
    };
  }

  public transformAll(): Record<string, TransformedSection> {
    return {
      demographics: this.transformDemographics(),
      methodology: this.transformMethodology(),
      medicalHistory: this.transformMedicalHistory(),
      subjective: this.transformSubjective(),
      functional: this.transformFunctional(),
      typicalDay: this.transformTypicalDay(),
      environmental: this.transformEnvironmental(),
      adl: this.transformADL(),
      attendantCare: this.transformAttendantCare(),
      amaGuides: this.transformAMAGuides()
    };
  }
}