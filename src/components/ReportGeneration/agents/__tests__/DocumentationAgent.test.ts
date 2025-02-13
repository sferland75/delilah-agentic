import { DocumentationAgent } from '../DocumentationAgent';
import { createMockContext } from '../../testing/mockData';
import { Assessment } from '../../../../types/report';

describe('DocumentationAgent', () => {
    const agent = new DocumentationAgent(createMockContext());

    const testData: Assessment = {
        id: 'test-123',
        date: '2025-01-27',
        documentation: {
            sources: [
                'Medical Records',
                'Patient Interview',
                'Family Report'
            ],
            gaps: [
                'No imaging reports available',
                'Missing previous therapy notes'
            ],
            reliability: 'Good',
            notes: 'Patient is consistent and engaged',
            medicalDocumentation: [
                {
                    type: 'Progress Note',
                    date: '2025-01-15',
                    provider: 'Dr. Smith',
                    findings: ['Improving strength', 'Better balance']
                }
            ],
            imagingReports: [
                {
                    type: 'X-Ray',
                    date: '2025-01-10',
                    facility: 'City Hospital',
                    findings: ['No acute findings']
                }
            ],
            assessmentTools: [
                {
                    name: 'Berg Balance Scale',
                    date: '2025-01-20',
                    score: 45,
                    interpretation: 'Low fall risk'
                }
            ]
        }
    } as Assessment;

    describe('processData', () => {
        it('processes documentation correctly', async () => {
            const result = await agent.processData(testData);
            expect(result.valid).toBe(true);
            expect(result.data.sources).toHaveLength(3);
            expect(result.data.gaps).toHaveLength(2);
            expect(result.data.reliability).toBe('Good');
        });

        it('processes medical documentation details', async () => {
            const result = await agent.processData(testData);
            expect(result.data.medicalDocumentation).toHaveLength(1);
            expect(result.data.imagingReports).toHaveLength(1);
            expect(result.data.assessmentTools).toHaveLength(1);
        });

        it('generates recommendations when needed', async () => {
            const result = await agent.processData(testData);
            expect(result.data.summary).toBeDefined();
            expect(result.data.summary).toContain('gaps');
        });
    });

    describe('formatting', () => {
        it('formats at different detail levels', async () => {
            const result = await agent.processData(testData);
            
            const brief = agent.getFormattedContent(result, 'brief');
            expect(brief).toContain('Documentation');
            expect(brief).toContain('Medical Documentation: 3');

            const detailed = agent.getFormattedContent(result, 'detailed');
            expect(detailed).toContain('DOCUMENTATION REVIEW AND ANALYSIS');
            expect(detailed).toContain('MEDICAL DOCUMENTATION');
            expect(detailed).toContain('IMAGING REPORTS');
        });

        it('handles minimal data gracefully', async () => {
            const minimalData = {
                ...testData,
                documentation: {
                    sources: [],
                    gaps: [],
                    reliability: 'good'
                }
            };

            const result = await agent.processData(minimalData);
            const formatted = agent.getFormattedContent(result, 'standard');
            expect(formatted).toContain('Medical Report');
            expect(formatted).not.toContain('undefined');
        });
    });
});