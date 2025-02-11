import { Assessment } from '@/types/assessment';
import { SectionTransformer, TransformedSection } from './sectionTransformer';
import { ClaudeReportGenerator } from './claudeReportGenerator';
import { generateWordDocument } from './reportUtils';
import SectionValidator, { ValidationError } from './sectionValidator';

export interface GenerationProgress {
  section: string;
  progress: number;
  status: 'pending' | 'processing' | 'complete' | 'error';
  error?: string;
}

export interface GenerationOptions {
  includeMethodology?: boolean;
  includeAttendantCare?: boolean;
  includeAMAGuides?: boolean;
  format?: 'docx' | 'pdf' | 'txt';
  onProgress?: (progress: GenerationProgress) => void;
  onValidationError?: (errors: ValidationError[]) => void;
}

export class ReportGenerator {
  private transformer: SectionTransformer;
  private claudeGenerator: ClaudeReportGenerator;
  private validator: typeof SectionValidator;
  private sections: Record<string, TransformedSection>;

  constructor(assessment: Assessment) {
    this.transformer = new SectionTransformer(assessment);
    this.claudeGenerator = new ClaudeReportGenerator();
    this.validator = SectionValidator;
    this.sections = {};
  }

  private async generateSection(
    sectionKey: string, 
    section: TransformedSection,
    onProgress?: (progress: GenerationProgress) => void
  ): Promise<string> {
    try {
      onProgress?.({
        section: section.title,
        progress: 0,
        status: 'processing'
      });

      // Validate section before generating
      const validationErrors = this.validator.validate(sectionKey, section);
      if (validationErrors.length > 0) {
        throw new Error(
          `Validation errors in ${sectionKey}: ${validationErrors.map(e => e.error).join(', ')}`
        );
      }

      // Generate narrative using Claude
      const narrative = await this.claudeGenerator.generateNarrative(
        sectionKey,
        section.content,
        section.subsections
      );

      // Validate generated narrative
      const narrativeSection = {
        ...section,
        content: narrative
      };
      const narrativeValidation = this.validator.validate(sectionKey, narrativeSection);
      if (narrativeValidation.length > 0) {
        throw new Error(
          `Generated narrative validation failed: ${narrativeValidation.map(e => e.error).join(', ')}`
        );
      }

      onProgress?.({
        section: section.title,
        progress: 100,
        status: 'complete'
      });

      return narrative;

    } catch (error) {
      onProgress?.({
        section: section.title,
        progress: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  public async generateReport(options: GenerationOptions = {}): Promise<Document | string> {
    const {
      includeMethodology = true,
      includeAttendantCare = true,
      includeAMAGuides = true,
      format = 'docx',
      onProgress,
      onValidationError
    } = options;

    try {
      // Transform all sections
      this.sections = this.transformer.transformAll();

      // Validate all sections before proceeding
      const validationErrors = this.validator.validateAll(this.sections);
      if (validationErrors.length > 0) {
        onValidationError?.(validationErrors);
        throw new Error('Validation errors found in sections');
      }

      // Filter sections based on options
      if (!includeMethodology) delete this.sections.methodology;
      if (!includeAttendantCare) delete this.sections.attendantCare;
      if (!includeAMAGuides) delete this.sections.amaGuides;

      // Generate narratives for each section
      const sectionCount = Object.keys(this.sections).length;
      let completedSections = 0;
      const narratives: Record<string, string> = {};

      for (const [key, section] of Object.entries(this.sections)) {
        narratives[key] = await this.generateSection(key, section, progress => {
          if (progress.status === 'complete') completedSections++;
          onProgress?.({
            ...progress,
            progress: (completedSections / sectionCount) * 100
          });
        });
      }

      // Validate relationships between generated narratives
      const narrativeSections = Object.entries(narratives).reduce(
        (acc, [key, content]) => ({
          ...acc,
          [key]: { ...this.sections[key], content }
        }),
        {}
      );
      const relationshipErrors = this.validator.validateAll(narrativeSections);
      if (relationshipErrors.length > 0) {
        onValidationError?.(relationshipErrors);
        throw new Error('Validation errors in generated narratives');
      }

      // Generate final document
      if (format === 'docx') {
        return generateWordDocument(narratives, this.transformer.assessment);
      }

      // For text format, just join narratives with section headers
      return Object.entries(narratives)
        .map(([key, content]) => `# ${this.sections[key].title}\n\n${content}`)
        .join('\n\n');

    } catch (error) {
      onProgress?.({
        section: 'Report Generation',
        progress: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }
}

export default ReportGenerator;