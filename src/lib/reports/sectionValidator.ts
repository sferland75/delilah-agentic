import { z } from 'zod';
import { TransformedSection } from './sectionTransformer';

// Required fields for each section type
const sectionBaseSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  subsections: z.record(z.string())
});

const demographicsSchema = sectionBaseSchema.extend({
  subsections: z.object({
    personal: z.string(),
    assessment: z.string(),
    fileInfo: z.string()
  })
});

const methodologySchema = sectionBaseSchema.extend({
  subsections: z.object({
    purpose: z.string(),
    consent: z.string(),
    methodology: z.string(),
    documentation: z.string()
  })
});

const medicalHistorySchema = sectionBaseSchema.extend({
  subsections: z.object({
    preAccident: z.string(),
    injury: z.string(),
    treatment: z.string(),
    medications: z.string()
  })
});

const subjectiveSchema = sectionBaseSchema.extend({
  subsections: z.object({
    physical: z.string(),
    cognitive: z.string(),
    emotional: z.string(),
    management: z.string()
  })
});

const functionalSchema = sectionBaseSchema.extend({
  subsections: z.object({
    tolerances: z.string(),
    mobility: z.string(),
    transfers: z.string(),
    rom: z.string(),
    strength: z.string(),
    presentation: z.string()
  })
});

const typicalDaySchema = sectionBaseSchema.extend({
  subsections: z.object({
    preAccident: z.string(),
    current: z.string(),
    comparison: z.string()
  })
});

const environmentalSchema = sectionBaseSchema.extend({
  subsections: z.object({
    property: z.string(),
    rooms: z.string(),
    safety: z.string()
  })
});

const adlSchema = sectionBaseSchema.extend({
  subsections: z.object({
    selfCare: z.string(),
    household: z.string(),
    community: z.string(),
    work: z.string(),
    leisure: z.string()
  })
});

const attendantCareSchema = sectionBaseSchema.extend({
  subsections: z.object({
    routine: z.string(),
    supervision: z.string(),
    complex: z.string(),
    calculations: z.string()
  })
});

const amaGuidesSchema = sectionBaseSchema.extend({
  subsections: z.object({
    adl: z.string(),
    social: z.string(),
    concentration: z.string(),
    adaptation: z.string()
  })
});

// Validation errors interface
export interface ValidationError {
  section: string;
  error: string;
  path?: string[];
}

export class SectionValidator {
  private schemas: Record<string, z.ZodType> = {
    demographics: demographicsSchema,
    methodology: methodologySchema,
    medicalHistory: medicalHistorySchema,
    subjective: subjectiveSchema,
    functional: functionalSchema,
    typicalDay: typicalDaySchema,
    environmental: environmentalSchema,
    adl: adlSchema,
    attendantCare: attendantCareSchema,
    amaGuides: amaGuidesSchema
  };

  // Check required fields and data types
  private validateSection(
    sectionKey: string,
    section: TransformedSection
  ): ValidationError[] {
    const schema = this.schemas[sectionKey];
    if (!schema) {
      return [{
        section: sectionKey,
        error: 'Invalid section type'
      }];
    }

    const result = schema.safeParse(section);
    if (!result.success) {
      return result.error.issues.map(issue => ({
        section: sectionKey,
        error: issue.message,
        path: issue.path
      }));
    }

    return [];
  }

  // Validate content makes sense for section type
  private validateContent(
    sectionKey: string,
    section: TransformedSection
  ): ValidationError[] {
    const errors: ValidationError[] = [];
    
    // Check minimum content length
    if (section.content.length < 50) {
      errors.push({
        section: sectionKey,
        error: 'Content length too short'
      });
    }

    // Check for required keywords based on section type
    const requiredTerms: Record<string, string[]> = {
      demographics: ['name', 'birth', 'assessment'],
      medicalHistory: ['injury', 'treatment'],
      functional: ['mobility', 'strength', 'range'],
      adl: ['self-care', 'activities'],
      attendantCare: ['care', 'assistance', 'supervision']
    };

    const terms = requiredTerms[sectionKey];
    if (terms) {
      const missingTerms = terms.filter(term => 
        !section.content.toLowerCase().includes(term.toLowerCase())
      );

      if (missingTerms.length > 0) {
        errors.push({
          section: sectionKey,
          error: `Missing required terms: ${missingTerms.join(', ')}`
        });
      }
    }

    return errors;
  }

  // Check relationships between sections
  private validateRelationships(
    sections: Record<string, TransformedSection>
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check methodology references demographics
    if (sections.methodology && sections.demographics) {
      if (!sections.methodology.content.includes(sections.demographics.title)) {
        errors.push({
          section: 'methodology',
          error: 'Methodology should reference client from demographics'
        });
      }
    }

    // Check typical day references functional status
    if (sections.typicalDay && sections.functional) {
      if (!sections.typicalDay.content.includes('function')) {
        errors.push({
          section: 'typicalDay',
          error: 'Typical day should reference functional status'
        });
      }
    }

    return errors;
  }

  public validate(
    sectionKey: string,
    section: TransformedSection,
    allSections?: Record<string, TransformedSection>
  ): ValidationError[] {
    let errors: ValidationError[] = [];

    // Validate section structure
    errors = errors.concat(this.validateSection(sectionKey, section));

    // Validate content if structure is valid
    if (errors.length === 0) {
      errors = errors.concat(this.validateContent(sectionKey, section));
    }

    // Validate relationships if all sections provided
    if (allSections) {
      errors = errors.concat(this.validateRelationships(allSections));
    }

    return errors;
  }

  public validateAll(
    sections: Record<string, TransformedSection>
  ): ValidationError[] {
    let errors: ValidationError[] = [];

    // Validate each section
    for (const [key, section] of Object.entries(sections)) {
      errors = errors.concat(this.validate(key, section, sections));
    }

    return errors;
  }
}

export default new SectionValidator();