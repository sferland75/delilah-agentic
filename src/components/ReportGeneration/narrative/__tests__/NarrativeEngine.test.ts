import { NarrativeEngine } from '../NarrativeEngine';
import { sampleAssessment } from './testData';

describe('NarrativeEngine', () => {
    let engine: NarrativeEngine;

    beforeEach(() => {
        engine = new NarrativeEngine({
            enableContextualAnalysis: true
        });
    });

    describe('Overview Generation', () => {
        it('generates comprehensive overview narrative', async () => {
            const narrative = await engine.generateNarrative(sampleAssessment, 'overview');
            
            // Should include patient name
            expect(narrative).toContain('John Doe');
            
            // Should include symptom information
            expect(narrative).toContain('lower back');
            expect(narrative).toContain('right shoulder');
        });
    });

    describe('Symptom Narrative', () => {
        it('generates detailed symptom narrative', async () => {
            const narrative = await engine.generateNarrative(sampleAssessment, 'symptoms');
            
            // Should contain symptom details
            expect(narrative).toContain('Lower back');
            expect(narrative).toContain('Right shoulder');
            expect(narrative).toContain('Moderate');
            expect(narrative).toContain('Severe');
            
            // Should include aggravating factors
            expect(narrative).toContain('Prolonged sitting');
            
            // Should include relieving factors
            expect(narrative).toContain('Rest');
        });
    });

    describe('Functional Narrative', () => {
        it('generates functional status narrative', async () => {
            const narrative = await engine.generateNarrative(sampleAssessment, 'functional');
            
            // Should contain transfer information
            expect(narrative).toContain('Modified Independent');
            expect(narrative).toContain('bed');
            expect(narrative).toContain('shower');
        });
    });

    describe('Error Handling', () => {
        it('handles null/undefined data gracefully', async () => {
            const nullNarrative = await engine.generateNarrative(null, 'overview');
            expect(nullNarrative).toContain('No data available');

            const undefinedNarrative = await engine.generateNarrative(undefined, 'overview');
            expect(undefinedNarrative).toContain('No data available');
        });

        it('handles invalid section names gracefully', async () => {
            const narrative = await engine.generateNarrative(sampleAssessment, 'invalid_section');
            expect(narrative).toBeDefined();
            expect(typeof narrative).toBe('string');
        });
    });
});