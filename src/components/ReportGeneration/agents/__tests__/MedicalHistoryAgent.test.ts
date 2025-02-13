import { MedicalHistoryAgent } from '../MedicalHistoryAgent';
import { createMockContext } from '../../testing/mockData';
import { Assessment } from '../../../../types/report';

describe('MedicalHistoryAgent', () => {
    const agent = new MedicalHistoryAgent(createMockContext());

    const testData: Assessment = {
        id: 'test-123',
        date: '2025-01-27',
        medicalHistory: {
            injury: {
                date: '2025-01-01',
                mechanism: 'Work-related incident',
                diagnosis: ['Lumbar strain'],
                impactAreas: ['Work', 'ADLs'],
                details: 'Injury occurred while lifting'
            },
            treatments: [{
                type: 'Physical Therapy',
                provider: 'ABC Clinic',
                frequency: 'Weekly',
                duration: '6 weeks',
                response: 'Moderate improvement'
            }],
            medications: [{
                name: 'Ibuprofen',
                dosage: '400mg',
                frequency: 'As needed',
                purpose: 'Pain management',
                response: 'Effective for acute pain'
            }],
            currentTreatment: [{
                type: 'Physical Therapy',
                provider: 'ABC Clinic',
                frequency: 'Weekly',
                goals: ['Improve strength', 'Increase mobility']
            }]
        }
    } as Assessment;

    describe('processData', () => {
        it('processes medical history correctly', async () => {
            const processed = await agent.processData(testData);
            expect(processed.valid).toBe(true);
            expect(processed.data.injury).toBeDefined();
            expect(processed.data.medications).toHaveLength(1);
            expect(processed.data.currentTreatment).toHaveLength(1);
        });

        it('handles missing data gracefully', async () => {
            const emptyData = { ...testData, medicalHistory: undefined };
            const processed = await agent.processData(emptyData);
            expect(processed.valid).toBe(false);
            expect(processed.error).toBeDefined();
        });
    });

    describe('formatting', () => {
        it('formats brief content correctly', async () => {
            const processed = await agent.processData(testData);
            const brief = agent.getFormattedContent(processed, 'brief');
            
            expect(brief).toContain('Work-related incident');
            expect(brief).toContain('Ibuprofen');
            expect(brief).toContain('Physical Therapy');
        });

        it('formats standard content correctly', async () => {
            const processed = await agent.processData(testData);
            const standard = agent.getFormattedContent(processed, 'standard');
            
            expect(standard).toContain('Injury Information:');
            expect(standard).toContain('Current Medications:');
            expect(standard).toContain('Current Treatment:');
            expect(standard).toContain('Lumbar strain');
            expect(standard).toContain('ABC Clinic');
        });

        it('formats detailed content correctly', async () => {
            const processed = await agent.processData(testData);
            const detailed = agent.getFormattedContent(processed, 'detailed');
            
            expect(detailed).toContain('MEDICAL HISTORY ASSESSMENT');
            expect(detailed).toContain('INJURY INFORMATION');
            expect(detailed).toContain('CURRENT MEDICATIONS');
            expect(detailed).toContain('CURRENT TREATMENT');
            expect(detailed).toContain('Improve strength');
            expect(detailed).toContain('Increase mobility');
        });

        it('handles empty data gracefully', async () => {
            const emptyMedicalHistory = {
                ...testData,
                medicalHistory: {
                    injury: null,
                    treatments: [],
                    medications: [],
                    currentTreatment: []
                }
            };

            const processed = await agent.processData(emptyMedicalHistory);
            const formatted = agent.getFormattedContent(processed, 'standard');
            expect(formatted).toContain('No significant medical history reported');
            expect(formatted).not.toContain('undefined');
        });
    });
});