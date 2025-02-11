import ReportGenerator from '../../ReportGenerator';
import { ClaudeReportGenerator } from '../../claudeReportGenerator';
import { SectionValidator } from '../../sectionValidator';
import { CacheManager } from '../../cacheManager';
import { mockAssessment } from '../mockData';

// Don't mock these - we want real integration between them
jest.unmock('../../ReportGenerator');
jest.unmock('../../sectionTransformer');
jest.unmock('../../sectionValidator');
jest.unmock('../../cacheManager');

// Mock Claude API calls
jest.mock('../../../claude', () => ({
  chat: jest.fn().mockResolvedValue({ content: 'Generated content' })
}));

describe('Report Generation Integration', () => {
  let generator: ReportGenerator;
  let cache: CacheManager<string>;

  beforeEach(() => {
    cache = new CacheManager();
    generator = new ReportGenerator(mockAssessment);
  });

  describe('Full Report Generation Flow', () => {
    it('generates complete report with all sections', async () => {
      const progressCallback = jest.fn();
      const report = await generator.generateReport({
        onProgress: progressCallback
      });

      // Verify progress tracking
      expect(progressCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          section: 'demographics',
          status: 'complete',
          progress: 100
        })
      );

      // Verify report structure
      expect(report).toContain('Demographics & Background');
      expect(report).toContain('Medical History');
      expect(report).toContain(mockAssessment.initial.demographics.firstName);
    });

    it('handles section regeneration with custom prompts', async () => {
      const customPrompt = {
        system: 'Custom system prompt',
        human: 'Custom human prompt'
      };

      // Generate initial section
      const initialSection = await generator.generateSection('demographics');
      
      // Regenerate with custom prompt
      const regeneratedSection = await generator.regenerateSection(
        'demographics',
        customPrompt
      );

      expect(regeneratedSection).not.toBe(initialSection);
    });

    it('maintains data consistency across transformations', async () => {
      const report = await generator.generateReport();
      
      // Check data consistency
      const sections = Object.keys(mockAssessment);
      sections.forEach(section => {
        if (typeof mockAssessment[section] === 'object') {
          Object.keys(mockAssessment[section]).forEach(key => {
            const value = mockAssessment[section][key];
            if (typeof value === 'string') {
              expect(report).toContain(value);
            }
          });
        }
      });
    });
  });

  describe('Validation Integration', () => {
    it('validates transformed data before generation', async () => {
      const validator = new SectionValidator();
      const validationSpy = jest.spyOn(validator, 'validateAll');

      await generator.generateReport();

      expect(validationSpy).toHaveBeenCalled();
      validationSpy.mockRestore();
    });

    it('halts generation on validation failure', async () => {
      const invalidAssessment = {
        initial: {
          demographics: {
            // Missing required fields
          }
        }
      };

      const invalidGenerator = new ReportGenerator(invalidAssessment);
      await expect(invalidGenerator.generateReport()).rejects.toThrow();
    });
  });

  describe('Caching Integration', () => {
    it('caches and reuses generated content', async () => {
      const claudeGenerator = new ClaudeReportGenerator();
      const section = 'demographics';
      const content = 'Test content';
      const subsections = { test: 'test' };

      // First generation
      await claudeGenerator.generateNarrative(section, content, subsections);
      
      // Second generation should use cache
      const cacheSpy = jest.spyOn(cache, 'get');
      await claudeGenerator.generateNarrative(section, content, subsections);

      expect(cacheSpy).toHaveBeenCalled();
      cacheSpy.mockRestore();
    });

    it('invalidates cache on prompt changes', async () => {
      const claudeGenerator = new ClaudeReportGenerator();
      const section = 'demographics';
      const content = 'Test content';
      const subsections = { test: 'test' };

      // Generate with original prompt
      await claudeGenerator.generateNarrative(section, content, subsections);

      // Generate with custom prompt
      const customPrompt = {
        system: 'Custom system prompt',
        human: 'Custom human prompt'
      };

      const cacheSpy = jest.spyOn(cache, 'get');
      await claudeGenerator.generateNarrative(
        section,
        content,
        subsections,
        customPrompt
      );

      expect(cacheSpy).toHaveReturnedWith(null);
      cacheSpy.mockRestore();
    });
  });

  describe('Error Recovery', () => {
    it('recovers from section generation failures', async () => {
      const errorCallback = jest.fn();
      const progressCallback = jest.fn();

      // Mock one section to fail
      jest.spyOn(ClaudeReportGenerator.prototype, 'generateNarrative')
        .mockRejectedValueOnce(new Error('Test error'))
        .mockResolvedValueOnce('Recovered content');

      await generator.generateReport({
        onError: errorCallback,
        onProgress: progressCallback
      });

      expect(errorCallback).toHaveBeenCalled();
      expect(progressCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'complete'
        })
      );
    });

    it('maintains partial results on failure', async () => {
      // Force second section to fail
      let completedSections = 0;
      jest.spyOn(ClaudeReportGenerator.prototype, 'generateNarrative')
        .mockImplementation(() => {
          completedSections++;
          if (completedSections === 2) {
            throw new Error('Test error');
          }
          return Promise.resolve('Generated content');
        });

      try {
        await generator.generateReport();
      } catch (error) {
        // Should have one completed section
        expect(completedSections).toBe(2);
      }
    });
  });

  describe('Performance', () => {
    it('handles concurrent section generation', async () => {
      const sections = ['demographics', 'medical', 'functional'];
      const startTime = Date.now();

      await Promise.all(
        sections.map(section => 
          generator.generateSection(section)
        )
      );

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should take less time than sequential generation
      expect(duration).toBeLessThan(sections.length * 1000);
    });

    it('respects rate limits during concurrent generation', async () => {
      const rateLimitSpy = jest.fn();
      const sections = ['demographics', 'medical', 'functional'];
      const startTime = Date.now();

      await Promise.all(
        sections.map(section => {
          rateLimitSpy();
          return generator.generateSection(section);
        })
      );

      // Should have been rate limited
      expect(rateLimitSpy).toHaveBeenCalledTimes(sections.length);
      expect(Date.now() - startTime).toBeGreaterThan(1000);
    });
  });
});