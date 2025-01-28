import { SymptomAnalyzer } from '../SymptomAnalyzer';
import { sampleAssessment } from './testData';

describe('SymptomAnalyzer', () => {
    let analyzer: SymptomAnalyzer;

    beforeEach(() => {
        analyzer = new SymptomAnalyzer();
    });

    it('analyzes physical symptoms correctly', async () => {
        const symptoms = sampleAssessment.assessment.symptoms.physical;
        const analyzed = await analyzer.analyzeSymptoms(symptoms, true);

        expect(analyzed).toBeDefined();
        expect(analyzed.length).toBe(2);
        
        // Check first symptom
        expect(analyzed[0]).toMatchObject({
            location: 'Lower back',
            severity: 'moderate',
            frequency: 'daily'
        });

        // Check triggers and relief
        expect(analyzed[0].triggers).toContain('Prolonged sitting');
        expect(analyzed[0].relief).toContain('Rest');
    });

    it('identifies patterns when contextual analysis is enabled', async () => {
        const symptoms = sampleAssessment.assessment.symptoms.physical;
        const analyzed = await analyzer.analyzeSymptoms(symptoms, true);

        // Check for patterns
        const shoulderSymptom = analyzed.find(s => s.location === 'Right shoulder');
        expect(shoulderSymptom?.pattern).toBeDefined();
    });

    it('handles empty or invalid input gracefully', async () => {
        const emptyResult = await analyzer.analyzeSymptoms([], true);
        expect(emptyResult).toEqual([]);

        const nullResult = await analyzer.analyzeSymptoms(null as any, true);
        expect(nullResult).toEqual([]);
    });
});