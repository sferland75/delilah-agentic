import { SectionHistory } from '../sectionHistory';
import { promptTemplates, formatPrompt } from '../promptTemplates';
import ReportGenerator from '../ReportGenerator';

describe('Section History', () => {
  let history: SectionHistory;

  beforeEach(() => {
    history = new SectionHistory();
  });

  it('adds and retrieves versions correctly', () => {
    history.addVersion('demographics', 'Version 1');
    history.addVersion('demographics', 'Version 2');

    const versions = history.getVersions('demographics');
    expect(versions).toHaveLength(2);
    expect(versions[1].content).toBe('Version 2');
  });

  it('maintains maximum version limit', () => {
    // Add more than max versions
    for (let i = 0; i < 7; i++) {
      history.addVersion('demographics', `Version ${i}`);
    }

    const versions = history.getVersions('demographics');
    expect(versions).toHaveLength(5); // Max versions
    expect(versions[4].content).toBe('Version 6');
  });

  it('gets last version correctly', () => {
    history.addVersion('demographics', 'Version 1');
    history.addVersion('demographics', 'Version 2');

    const lastVersion = history.getLastVersion('demographics');
    expect(lastVersion?.content).toBe('Version 2');
  });

  it('clears history for a section', () => {
    history.addVersion('demographics', 'Version 1');
    history.clear('demographics');

    const versions = history.getVersions('demographics');
    expect(versions).toHaveLength(0);
  });
});

describe('Prompt Templates', () => {
  it('formats prompts correctly', () => {
    const data = 'Test data';
    const formatted = formatPrompt('demographics', data);

    expect(formatted.system).toBeDefined();
    expect(formatted.human).toContain(data);
  });

  it('maintains prompt structure', () => {
    const formatted = formatPrompt('medicalHistory', 'Test data');

    expect(formatted.system).toContain('occupational therapist');
    expect(formatted.human).toContain('Include:');
  });

  it('contains all required sections', () => {
    const requiredSections = [
      'demographics',
      'methodology',
      'medicalHistory',
      'subjective',
      'functional',
      'typicalDay',
      'environmental',
      'adl',
      'attendantCare',
      'amaGuides'
    ];

    requiredSections.forEach(section => {
      expect(promptTemplates[section]).toBeDefined();
      expect(promptTemplates[section].system).toBeDefined();
      expect(promptTemplates[section].human).toBeDefined();
    });
  });
});

describe('Report Generator Integration', () => {
  const mockAssessment = {
    initial: {
      demographics: {
        firstName: 'John',
        lastName: 'Doe'
      }
    }
  };

  it('transforms sections correctly', async () => {
    const generator = new ReportGenerator(mockAssessment);
    const sections = await generator.transformSections();

    expect(sections.demographics).toBeDefined();
    expect(sections.demographics.title).toBe('Demographics & Background');
  });

  it('handles generation errors gracefully', async () => {
    const generator = new ReportGenerator({});
    
    await expect(generator.generateReport()).rejects.toThrow();
  });

  it('tracks progress during generation', async () => {
    const progressCallback = jest.fn();
    const generator = new ReportGenerator(mockAssessment);

    await generator.generateReport({
      onProgress: progressCallback
    });

    expect(progressCallback).toHaveBeenCalled();
    expect(progressCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'complete',
        progress: 100
      })
    );
  });

  it('validates sections before generation', async () => {
    const generator = new ReportGenerator(mockAssessment);
    const validationCallback = jest.fn();

    await generator.generateReport({
      onValidationError: validationCallback
    });

    expect(validationCallback).not.toHaveBeenCalled();
  });
});