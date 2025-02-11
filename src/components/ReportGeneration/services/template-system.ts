import { REPORT_SECTIONS, getOrderedSections, validateSection, extractSectionData } from './template-structure';
import { AssessmentData, ReportSection } from '../types';
import { NarrativeGenerator } from './narrative-generator';

export class TemplateSystem {
  private narrator: NarrativeGenerator;

  constructor() {
    this.narrator = new NarrativeGenerator();
  }

  async generateReport(data: AssessmentData): Promise<string> {
    const orderedSections = getOrderedSections();
    const reportSections = await Promise.all(
      orderedSections.map(section => this.generateSection(section, data))
    );

    return reportSections.join('\n\n');
  }

  private async generateSection(
    sectionKey: string,
    data: AssessmentData
  ): Promise<string> {
    const sectionConfig = REPORT_SECTIONS[sectionKey];
    
    // Validate required data
    if (!validateSection(sectionKey, data)) {
      console.warn(`Missing required data for section: ${sectionKey}`);
      return '';
    }

    // Extract relevant data
    const sectionData = extractSectionData(sectionKey, data);

    // Generate section content
    let content = `${sectionConfig.title || sectionKey.toUpperCase()}\n\n`;

    // Handle subsections if they exist
    if (sectionConfig.subsections) {
      const subsectionContent = await Promise.all(
        Object.entries(sectionConfig.subsections)
          .sort(([,a], [,b]) => a.order - b.order)
          .map(async ([subsectionKey, subsectionConfig]) => {
            const subsectionData = extractSectionData(subsectionKey, sectionData);
            return this.generateSubsection(
              sectionKey,
              subsectionKey,
              subsectionData
            );
          })
      );
      content += subsectionContent.join('\n\n');
    } else {
      // Generate narrative for main section
      content += await this.narrator.generateNarrative(
        sectionKey,
        sectionData
      );
    }

    return content;
  }

  private async generateSubsection(
    sectionKey: string,
    subsectionKey: string,
    data: any
  ): Promise<string> {
    return this.narrator.generateNarrative(
      `${sectionKey}.${subsectionKey}`,
      data
    );
  }

  // Helper method to get template placeholders for a section
  getTemplatePlaceholders(section: string): string[] {
    const sectionConfig = REPORT_SECTIONS[section];
    const placeholders: string[] = [];

    if (sectionConfig.dataPath) {
      // Add placeholders based on data paths
      sectionConfig.dataPath.forEach(path => {
        if (Array.isArray(path)) {
          path.forEach(p => placeholders.push(`{{${p}}}`));
        } else {
          placeholders.push(`{{${path}}}`);
        }
      });
    }

    if (sectionConfig.fields) {
      // Add placeholders for specific fields
      sectionConfig.fields.forEach(field => 
        placeholders.push(`{{${field}}}`)
      );
    }

    return placeholders;
  }

  // Helper method to validate all required sections
  validateAssessment(data: AssessmentData): boolean {
    return Object.keys(REPORT_SECTIONS).every(section => 
      validateSection(section, data)
    );
  }

  // Helper method to get section data requirements
  getSectionRequirements(section: string): string[] {
    const sectionConfig = REPORT_SECTIONS[section];
    const requirements: string[] = [];

    if (sectionConfig.dataPath) {
      requirements.push(
        ...sectionConfig.dataPath.map(path => 
          Array.isArray(path) ? path.join(' or ') : path
        )
      );
    }

    if (sectionConfig.fields) {
      requirements.push(...sectionConfig.fields);
    }

    return requirements;
  }
}