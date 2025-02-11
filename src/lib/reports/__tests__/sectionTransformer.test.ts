import { SectionTransformer } from '../sectionTransformer';
import { mockAssessment } from './mockData';

describe('SectionTransformer', () => {
  let transformer: SectionTransformer;

  beforeEach(() => {
    transformer = new SectionTransformer(mockAssessment);
  });

  describe('Demographics Transformation', () => {
    it('transforms demographics section correctly', () => {
      const sections = transformer.transformAll();
      const demographics = sections.demographics;

      expect(demographics.title).toBe('Demographics & Background');
      expect(demographics.content).toContain(mockAssessment.initial.demographics.firstName);
      expect(demographics.content).toContain(mockAssessment.initial.demographics.lastName);
      expect(demographics.subsections).toHaveProperty('personal');
      expect(demographics.subsections).toHaveProperty('assessment');
      expect(demographics.subsections).toHaveProperty('fileInfo');
    });

    it('handles missing demographics data', () => {
      const emptyTransformer = new SectionTransformer({ initial: {} });
      const sections = emptyTransformer.transformAll();
      
      expect(sections.demographics.content).toContain('Not specified');
    });
  });

  describe('Medical History Transformation', () => {
    it('transforms medical history correctly', () => {
      const sections = transformer.transformAll();
      const medical = sections.medicalHistory;

      expect(medical.title).toBe('Medical History');
      expect(medical.content).toContain(mockAssessment.medical.injury.description);
      expect(medical.content).toContain(mockAssessment.medical.treatments[0].providerName);
      expect(medical.subsections).toHaveProperty('preAccident');
      expect(medical.subsections).toHaveProperty('injury');
      expect(medical.subsections).toHaveProperty('treatment');
    });

    it('formats medications correctly', () => {
      const sections = transformer.transformAll();
      const medical = sections.medicalHistory;

      mockAssessment.medical.medications.forEach(med => {
        expect(medical.content).toContain(med.name);
        expect(medical.content).toContain(med.dosage);
      });
    });
  });

  describe('Symptoms Transformation', () => {
    it('transforms symptoms correctly', () => {
      const sections = transformer.transformAll();
      const symptoms = sections.subjective;

      mockAssessment.symptoms.physical.forEach(symptom => {
        expect(symptoms.content).toContain(symptom.location);
        expect(symptoms.content).toContain(symptom.severity);
      });
    });

    it('categorizes symptoms appropriately', () => {
      const sections = transformer.transformAll();
      const symptoms = sections.subjective;

      expect(symptoms.subsections).toHaveProperty('physical');
      expect(symptoms.subsections).toHaveProperty('cognitive');
      expect(symptoms.subsections).toHaveProperty('emotional');
    });
  });

  describe('Functional Assessment Transformation', () => {
    it('transforms functional data correctly', () => {
      const sections = transformer.transformAll();
      const functional = sections.functional;

      expect(functional.content).toContain(mockAssessment.functional.tolerances.standing);
      expect(functional.content).toContain(mockAssessment.functional.tolerances.walking);
    });

    it('formats mobility status correctly', () => {
      const sections = transformer.transformAll();
      const functional = sections.functional;

      expect(functional.content).toContain(mockAssessment.functional.mobility.gait);
      expect(functional.content).toContain(mockAssessment.functional.mobility.balance);
    });
  });

  describe('Environmental Assessment Transformation', () => {
    it('transforms environmental data correctly', () => {
      const sections = transformer.transformAll();
      const environmental = sections.environmental;

      expect(environmental.content).toContain(mockAssessment.environmental.property.type);
      mockAssessment.environmental.rooms.forEach(room => {
        expect(environmental.content).toContain(room.type);
      });
    });

    it('includes safety considerations', () => {
      const sections = transformer.transformAll();
      const environmental = sections.environmental;

      mockAssessment.environmental.hazards.forEach(hazard => {
        expect(environmental.content).toContain(hazard);
      });
    });
  });

  describe('Typical Day Transformation', () => {
    it('transforms typical day data correctly', () => {
      const sections = transformer.transformAll();
      const typicalDay = sections.typicalDay;

      expect(typicalDay.content).toContain('Pre-Accident Routine');
      expect(typicalDay.content).toContain('Current Routine');
    });

    it('includes all time periods', () => {
      const sections = transformer.transformAll();
      const typicalDay = sections.typicalDay;

      ['morning', 'afternoon', 'evening'].forEach(period => {
        expect(typicalDay.content).toContain(
          mockAssessment.typicalDay.preAccident[period][0]
        );
        expect(typicalDay.content).toContain(
          mockAssessment.typicalDay.current[period][0]
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('handles missing sections gracefully', () => {
      const incompleteAssessment = {
        initial: mockAssessment.initial
        // Missing other sections
      };

      const incompleteTransformer = new SectionTransformer(incompleteAssessment);
      const sections = incompleteTransformer.transformAll();

      expect(sections.demographics).toBeDefined();
      expect(sections.medicalHistory.content).toContain('Not documented');
    });

    it('sanitizes potentially unsafe content', () => {
      const unsafeAssessment = {
        initial: {
          demographics: {
            firstName: '<script>alert("xss")</script>',
            lastName: 'Test'
          }
        }
      };

      const safeTransformer = new SectionTransformer(unsafeAssessment);
      const sections = safeTransformer.transformAll();

      expect(sections.demographics.content).not.toContain('<script>');
    });
  });

  describe('Formatting', () => {
    it('formats dates consistently', () => {
      const sections = transformer.transformAll();
      const dateRegex = /[A-Z][a-z]+ \d{1,2}, \d{4}/;

      expect(sections.demographics.content).toMatch(dateRegex);
      expect(sections.medicalHistory.content).toMatch(dateRegex);
    });

    it('maintains consistent section structure', () => {
      const sections = transformer.transformAll();

      Object.values(sections).forEach(section => {
        expect(section).toHaveProperty('title');
        expect(section).toHaveProperty('content');
        expect(section).toHaveProperty('subsections');
      });
    });
  });
});