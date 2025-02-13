import { PhysicalSymptomsAgent } from '../PhysicalSymptomsAgent';
import { createMockContext } from '../../../testing/mockData';
import { Assessment } from '../../../../../types/report';

describe('PhysicalSymptomsAgent', () => {
    const agent = new PhysicalSymptomsAgent(createMockContext());

    const testData: Assessment = {
        id: 'test-123',
        date: '2025-01-27',
        symptoms: {
            physical: [{
                location: 'lower back',
                severity: 'moderate',
                frequency: 'frequent',
                painType: 'aching',
                temporalPattern: 'worse in mornings',
                aggravating: 'prolonged sitting',
                relieving: 'movement and stretching',
                impact: ['difficulty with prolonged sitting', 'limits bending']
            }],
            cognitive: [],
            emotional: []
        }
    } as Assessment;

    it('processes symptom data correctly', async () => {
        const processed = await agent.processData(testData);
        expect(processed.valid).toBe(true);
        expect(processed.data).toBeDefined();
        expect(processed.data.symptoms).toHaveLength(1);
        expect(processed.data.symptoms[0].location).toBe('lower back');
    });

    it('formats content at different detail levels', async () => {
        const processed = await agent.processData(testData);
        
        // Use public methods for accessing protected formatting
        const brief = agent.getFormattedContent(processed, 'brief');
        expect(brief).toContain('lower back');
        expect(brief).toContain('moderate');

        const standard = agent.getFormattedContent(processed, 'standard');
        expect(standard).toContain('Physical Symptoms:');
        expect(standard).toContain('aching');

        const detailed = agent.getFormattedContent(processed, 'detailed');
        expect(detailed).toContain('Aggravating Factors:');
        expect(detailed).toContain('Relieving Factors:');
    });

    it('handles empty symptoms gracefully', async () => {
        const emptyData = {
            ...testData,
            symptoms: {
                physical: [],
                cognitive: [],
                emotional: []
            }
        };

        const processed = await agent.processData(emptyData);
        expect(processed.valid).toBe(true);
        expect(processed.data.symptoms).toHaveLength(0);

        const formatted = agent.getFormattedContent(processed, 'standard');
        expect(formatted).toContain('No physical symptoms reported');
        expect(formatted).not.toContain('undefined');
    });
});