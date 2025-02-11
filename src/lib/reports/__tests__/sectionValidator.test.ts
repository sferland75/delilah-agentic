import { SectionValidator, ValidationError } from '../sectionValidator';
import { TransformedSection } from '../sectionTransformer';

describe('SectionValidator', () => {
  const validator = new SectionValidator();

  // Valid section examples
  const validDemographics: TransformedSection = {
    title: 'Demographics & Background',
    content: 'Test demographics content that includes name, birth, and assessment details',
    subsections: {
      personal: 'Client information',
      assessment: 'Assessment details',
      fileInfo: 'File information'
    }
  };

  const validMedical: TransformedSection = {
    title: 'Medical History',
    content: 'Test medical content that includes injury and treatment details',
    subsections: {
      preAccident: 'Pre-accident history',
      injury: 'Injury description',
      treatment: 'Current treatment',
      medications: 'Current medications'
    }
  };

  describe('Basic Validation', () => {
    it('validates correct demographics section', () => {
      const errors = validator.validate('demographics', validDemographics);
      expect(errors).toHaveLength(0);
    });

    it('validates correct medical section', () => {
      const errors = validator.validate('medical', validMedical);
      expect(errors).toHaveLength(0);
    });

    it('detects missing required fields', () => {
      const invalidSection = {
        title: 'Test',
        content: 'Content'
        // missing subsections
      };

      const errors = validator.validate('demographics', invalidSection as TransformedSection);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].error).toContain('required');
    });

    it('detects invalid section type', () => {
      const errors = validator.validate('invalid-type', validDemographics);
      expect(errors.length).toBe(1);
      expect(errors[0].error).toBe('Invalid section type');
    });
  });

  describe('Content Validation', () => {
    it('checks minimum content length', () => {
      const shortContent: TransformedSection = {
        ...validDemographics,
        content: 'Too short'
      };

      const errors = validator.validate('demographics', shortContent);
      expect(errors.length).toBe(1);
      expect(errors[0].error).toBe('Content length too short');
    });

    it('validates required keywords', () => {
      const missingKeywords: TransformedSection = {
        ...validDemographics,
        content: 'Some content without required keywords'
      };

      const errors = validator.validate('demographics', missingKeywords);
      expect(errors.length).toBe(1);
      expect(errors[0].error).toContain('Missing required terms');
    });
  });

  describe('Relationship Validation', () => {
    it('validates section relationships', () => {
      const sections = {
        demographics: validDemographics,
        medical: validMedical
      };

      const errors = validator.validateAll(sections);
      expect(errors).toHaveLength(0);
    });

    it('detects missing references', () => {
      const sections = {
        methodology: {
          title: 'Methodology',
          content: 'Methodology without client reference',
          subsections: {
            purpose: 'Purpose',
            consent: 'Consent',
            methodology: 'Methods',
            documentation: 'Docs'
          }
        },
        demographics: validDemographics
      };

      const errors = validator.validateAll(sections);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Specific Section Validation', () => {
    it('validates ADL section', () => {
      const validADL: TransformedSection = {
        title: 'Activities of Daily Living',
        content: 'Content including self-care activities and detailed assessments',
        subsections: {
          selfCare: 'Self-care activities',
          household: 'Household tasks',
          community: 'Community access',
          work: 'Work status',
          leisure: 'Social and leisure'
        }
      };

      const errors = validator.validate('adl', validADL);
      expect(errors).toHaveLength(0);
    });

    it('validates functional section', () => {
      const validFunctional: TransformedSection = {
        title: 'Functional Assessment',
        content: 'Content including mobility, strength, and range details',
        subsections: {
          tolerances: 'Physical tolerances',
          mobility: 'Mobility status',
          transfers: 'Transfer abilities',
          rom: 'Range of motion',
          strength: 'Strength',
          presentation: 'Clinical presentation'
        }
      };

      const errors = validator.validate('functional', validFunctional);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Error Reporting', () => {
    it('provides detailed error information', () => {
      const invalidSection: TransformedSection = {
        title: '',  // Invalid
        content: 'Test content',
        subsections: {
          personal: 'Info'
        }
      };

      const errors = validator.validate('demographics', invalidSection);
      expect(errors[0]).toHaveProperty('section', 'demographics');
      expect(errors[0]).toHaveProperty('error');
      expect(errors[0]).toHaveProperty('path');
    });

    it('handles multiple errors', () => {
      const multipleErrors: TransformedSection = {
        title: '',  // Invalid
        content: '',  // Invalid
        subsections: {}  // Invalid
      };

      const errors = validator.validate('demographics', multipleErrors);
      expect(errors.length).toBeGreaterThan(1);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty content gracefully', () => {
      const emptySection: TransformedSection = {
        title: 'Title',
        content: '',
        subsections: {}
      };

      const errors = validator.validate('demographics', emptySection);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('validates section order relationships', () => {
      const sections = {
        demographics: validDemographics,
        methodology: {
          title: 'Methodology',
          content: 'References client John Doe from demographics',
          subsections: {
            purpose: 'Purpose',
            consent: 'Consent',
            methodology: 'Methods',
            documentation: 'Docs'
          }
        }
      };

      const errors = validator.validateAll(sections);
      expect(errors).toHaveLength(0);
    });
  });
});