// Template system for medico-legal reports
class ReportTemplateSystem {
  constructor() {
    this.templates = {
      default: {
        sections: {
          header: {
            order: 1,
            template: `
MEDICO-LEGAL ASSESSMENT REPORT

Date of Report: {{reportDate}}
Date of Assessment: {{assessmentDate}}

IDENTIFYING INFORMATION
Name: {{firstName}} {{lastName}}
Date of Birth: {{dateOfBirth}}
Date of Incident: {{incidentDate}}
Claim Number: {{claimNumber}}
            `,
          },
          purpose: {
            order: 2,
            template: `
PURPOSE OF ASSESSMENT

This medical-legal assessment was conducted to evaluate the functional status, care needs, 
and rehabilitation potential of {{firstName}} {{lastName}} following {{accidentType}} on {{incidentDate}}.
The assessment included a comprehensive review of medical documentation, functional testing,
and analysis of daily living activities.
            `,
          },
          methodology: {
            order: 3,
            template: `
METHODOLOGY

The following assessment methods were employed:
1. Comprehensive review of medical and legal documentation
2. In-person functional assessment
3. Clinical interview and observation
4. Standardized testing including:
   - Range of motion measurements
   - Manual muscle testing
   - Berg Balance Scale
   - Activities of daily living assessment
5. Environmental assessment
            `,
          },
          documentation: {
            order: 4,
            template: `
DOCUMENTATION REVIEWED

The following documents were reviewed as part of this assessment:
{{documentList}}
            `,
          },
          background: {
            order: 5,
            template: `
BACKGROUND INFORMATION

{{backgroundNarrative}}
            `,
          },
          injuries: {
            order: 6,
            template: `
INJURIES AND TREATMENT

{{injuryNarrative}}
            `,
          },
          currentStatus: {
            order: 7,
            template: `
CURRENT STATUS

Physical Status:
{{physicalStatus}}

Cognitive Status:
{{cognitiveStatus}}

Emotional/Behavioral Status:
{{emotionalStatus}}
            `,
          },
          functioning: {
            order: 8,
            template: `
CURRENT FUNCTIONING

Activities of Daily Living:
{{adlNarrative}}

Instrumental Activities:
{{iadlNarrative}}

Work Status:
{{workStatus}}
            `,
          },
          environmental: {
            order: 9,
            template: `
ENVIRONMENTAL ASSESSMENT

Home Environment:
{{homeEnvironment}}

Safety Considerations:
{{safetyConsiderations}}

Recommended Modifications:
{{modifications}}
            `,
          },
          careNeeds: {
            order: 10,
            template: `
CARE NEEDS AND RECOMMENDATIONS

Current Care Arrangements:
{{currentCare}}

Recommended Care:
{{recommendedCare}}

Cost Analysis:
{{costAnalysis}}
            `,
          },
          conclusion: {
            order: 11,
            template: `
CONCLUSIONS AND RECOMMENDATIONS

{{conclusionNarrative}}

Impairment Ratings:
{{impairmentRatings}}

Recommendations:
{{recommendations}}
            `,
          },
          signature: {
            order: 12,
            template: `
Sincerely,

{{assessorName}}
{{assessorCredentials}}
{{assessorLicense}}
            `,
          }
        }
      }
    };
  }

  // Load custom templates
  loadTemplate(name, template) {
    this.templates[name] = template;
  }

  // Generate report using template and data
  generateReport(templateName = 'default', data, dynamicContent) {
    const template = this.templates[templateName];
    if (!template) throw new Error(`Template '${templateName}' not found`);

    // Sort sections by order
    const orderedSections = Object.entries(template.sections)
      .sort(([,a], [,b]) => a.order - b.order);

    // Generate each section
    const sections = orderedSections.map(([sectionName, section]) => {
      let sectionContent = section.template;

      // Replace static placeholders
      sectionContent = this.replaceStaticPlaceholders(sectionContent, data);

      // Insert dynamic content
      if (dynamicContent && dynamicContent[sectionName]) {
        sectionContent = this.insertDynamicContent(sectionContent, dynamicContent[sectionName]);
      }

      return sectionContent;
    });

    return sections.join('\n\n');
  }

  // Replace static placeholders with data
  replaceStaticPlaceholders(text, data) {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  // Insert dynamic content into template
  insertDynamicContent(template, content) {
    // Find dynamic content markers and replace with generated content
    Object.entries(content).forEach(([key, value]) => {
      const marker = `{{${key}}}`;
      template = template.replace(marker, value);
    });
    return template;
  }

  // Add a new section to a template
  addSection(templateName, sectionName, sectionConfig) {
    if (!this.templates[templateName]) {
      throw new Error(`Template '${templateName}' not found`);
    }
    
    this.templates[templateName].sections[sectionName] = sectionConfig;
  }

  // Modify an existing section
  modifySection(templateName, sectionName, newConfig) {
    if (!this.templates[templateName]) {
      throw new Error(`Template '${templateName}' not found`);
    }
    if (!this.templates[templateName].sections[sectionName]) {
      throw new Error(`Section '${sectionName}' not found in template '${templateName}'`);
    }
    
    this.templates[templateName].sections[sectionName] = {
      ...this.templates[templateName].sections[sectionName],
      ...newConfig
    };
  }
}

module.exports = ReportTemplateSystem;