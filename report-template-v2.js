const REPORT_SECTIONS = {
  // Previous generic sections remain...

  functionalAssessment: (data) => `Generate the functional assessment sections following this format:

[Example]
TOLERANCES, MOBILITY AND TRANSFERS:
The client's functional mobility and positional tolerances show significant changes. Their current presentation demonstrates limitations across aspects of mobility and positioning, requiring various compensatory strategies and assistance for safe function.

Active Range of Motion:
Legend:
WFL: Within Functional Limits
%: approximate percentage of normal range
Nominal: less than 25% range

[ROM measurements to be detailed]

EMOTIONAL AND COGNITIVE PRESENTATION:
Throughout the assessment, the client demonstrated changes in emotional and cognitive functioning that notably impacted their ability to participate in the evaluation process...
[End Example]

Assessment Data:
ROM Measurements: ${JSON.stringify(data.functionalAssessment.rangeOfMotion)}
Berg Balance: ${JSON.stringify(data.functionalAssessment.bergBalance)}
Manual Muscle Testing: ${JSON.stringify(data.functionalAssessment.manualMuscleTesting)}
Cognitive Symptoms: ${JSON.stringify(data.symptoms.cognitive)}
Emotional Symptoms: ${JSON.stringify(data.symptoms.emotional)}

Generate these sections maintaining professional medical-legal style.`,

  typicalDay: (data) => `Generate the TYPICAL DAY section comparing routines.

[Example]
TYPICAL DAY:
The client's current daily routine demonstrates significant changes from their pre-accident level of activity and independence.

Current Daily Routine:
The client's day typically begins [details about schedule, activities, limitations]...

Pre-Accident Routine:
Prior to the accident, the client maintained [details about previous schedule and capabilities]...

The contrast between pre- and post-accident daily routines highlights significant impacts on all aspects of daily function...
[End Example]

Client Data:
Pre-accident routine: ${JSON.stringify(data.typicalDay.preAccident)}
Current routine: ${JSON.stringify(data.typicalDay.current)}`,

  environmental: (data) => `Generate the ENVIRONMENTAL ASSESSMENT section.

[Example]
ENVIRONMENTAL ASSESSMENT:
The client's current residence presents the following considerations for function and safety...

The property features [details about layout, access points, barriers]...

The environmental challenges have contributed to increased dependence and limited participation in household activities...
[End Example]

Assessment Data:
Property Overview: ${JSON.stringify(data.environmental.propertyOverview)}
Room Details: ${JSON.stringify(data.environmental.rooms)}
Safety Concerns: ${JSON.stringify(data.environmental.safety)}`,

  adl: (data) => `Generate the ACTIVITIES OF DAILY LIVING section.

[Example]
ACTIVITIES OF DAILY LIVING:
Self-Care Activities:
The client demonstrates changes in ability to manage personal care activities since the accident...

Household Management:
Current household management capabilities contrast significantly with pre-accident function...

Financial Management:
The client's ability to manage finances shows the following changes...

Community Access:
Community participation has been impacted in the following ways...

Caregiving Activities:
The client's caregiving role has changed as follows...

Vocational Activities:
The client's employment status and capabilities show the following changes...

Social and Leisure Activities:
Social engagement patterns have changed in the following ways...

Sleep Patterns:
Sleep has been impacted with the following changes...
[End Example]

Assessment Data:
Basic ADLs: ${JSON.stringify(data.adl.basic)}
Instrumental ADLs: ${JSON.stringify(data.adl.iadl)}
Work Status: ${JSON.stringify(data.adl.work)}`,

  attendantCare: (data) => `Generate the ASSESSMENT OF ATTENDANT CARE NEEDS section.

[Example]
ASSESSMENT OF ATTENDANT CARE NEEDS:
Based on client reports and direct observations, the following attendant care needs have been identified:

Part 1 - Level 1 Attendant Care (Routine Personal Care)
[Details of basic care needs]

Part 2 – Level 2 Attendant Care (Basic supervisory functions)
[Details of supervision requirements]

Part 3 – Level 3 Attendant Care (Complex health/care and hygiene functions)
[Details of complex care needs]

Attendant Care Calculation:
[Detailed calculations following Form 1 guidelines]
[End Example]

Care Data: ${JSON.stringify(data.care)}
ADL Data: ${JSON.stringify(data.adl)}`,

  situationalAssessment: (data) => `Generate the SITUATIONAL FUNCTIONAL TASK DEMONSTRATION section.

[Example]
SITUATIONAL FUNCTIONAL TASK DEMONSTRATION:
To augment the occupational therapy in-home assessment findings, structured situational assessment was conducted...

The assessment revealed functional limitations across multiple domains:
- Mobility requirements and limitations
- Upper extremity function
- Activity tolerance
- Safety considerations
- Required adaptations
[End Example]

Assessment Data:
Functional Data: ${JSON.stringify(data.functionalAssessment)}
ADL Data: ${JSON.stringify(data.adl)}`,

  amaGuides: (data) => `Generate the ASSESSMENT OF THE FOUR SPHERES OF FUNCTION section.

[Example]
ASSESSMENT OF THE FOUR SPHERES OF FUNCTION (AMA GUIDES, 4TH EDITION)

ACTIVITIES OF DAILY LIVING
The client demonstrates the following changes in activities of daily living...

SOCIAL FUNCTIONING
Social functioning has been impacted in the following ways...

CONCENTRATION, PERSISTENCE AND PACE
The client's ability to sustain focused attention shows the following changes...

ADAPTATION
Adaptation to environmental demands and changes shows the following patterns...
[End Example]

AMA Assessment Data: ${JSON.stringify(data.amaGuides)}
Supporting Data:
ADL: ${JSON.stringify(data.adl)}
Symptoms: ${JSON.stringify(data.symptoms)}
Functional: ${JSON.stringify(data.functionalAssessment)}`,
};

class ReportGenerator {
  constructor() {
    this.data = null;
  }

  async generateReport(assessmentData) {
    this.data = assessmentData;

    const sections = [
      'header',
      'purpose',
      'medicalHistory',
      'symptoms',
      'functionalAssessment',
      'typicalDay',
      'environmental',
      'adl',
      'attendantCare',
      'situationalAssessment',
      'amaGuides'
    ];

    let report = '';
    for (const section of sections) {
      if (typeof REPORT_SECTIONS[section] === 'function') {
        const prompt = REPORT_SECTIONS[section](this.data);
        if (section === 'header') {
          report += prompt;
        } else {
          report += '\n\n' + await this.getNarrativeFromClaude(prompt);
        }
      }
    }

    return report;
  }

  async getNarrativeFromClaude(prompt) {
    // Claude API integration to come
    return prompt; // Placeholder
  }
}

module.exports = ReportGenerator;