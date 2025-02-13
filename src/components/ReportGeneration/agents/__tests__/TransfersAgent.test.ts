import { TransfersAgent } from '../TransfersAgent';
import { createMockContext } from '../../testing/mockData';
import { Assessment } from '../../../../types/report';

describe('TransfersAgent', () => {
    const agent = new TransfersAgent(createMockContext());

    const testData: Assessment = {
        id: 'test',
        date: '2025-01-27',
        functionalAssessment: {
            transfers: {
                bedMobility: {
                    independence: 'modified independent',
                    modifications: ['uses bed rail'],
                    comments: 'Requires additional time'
                },
                sitToStand: {
                    independence: 'independent',
                    comments: 'No difficulties noted'
                },
                car: {
                    independence: 'modified independent',
                    modifications: ['uses grab bar'],
                    comments: 'Requires technique training'
                }
            },
            bergBalance: {
                totalScore: 45,
                items: {
                    sittingBalance: 4,
                    standingBalance: 3,
                    transfers: 4
                }
            }
        },
        adl: {
            transfers: {
                independence: 'modified independent',
                modifications: ['grab bars'],
                comments: 'Uses equipment appropriately'
            },
            toileting: {
                independence: 'modified independent',
                modifications: ['grab bars', 'raised toilet'],
                comments: 'Safe with equipment'
            },
            bathing: {
                independence: 'modified independent',
                modifications: ['shower chair', 'grab bars'],
                comments: 'Independent with setup'
            }
        }
    } as Assessment;

    describe('processData', () => {
        it('processes transfer data correctly', async () => {
            const result = await agent.processData(testData);
            expect(result.valid).toBe(true);
            expect(result.data.transfers).toBeDefined();
            expect(result.data.transfers.bedMobility).toBeDefined();
            expect(result.data.balanceRisk).toBe('Low fall risk');
        });

        it('analyzes balance data', async () => {
            const highRiskData = {
                ...testData,
                functionalAssessment: {
                    ...testData.functionalAssessment,
                    bergBalance: {
                        totalScore: 30
                    }
                }
            };

            const result = await agent.processData(highRiskData);
            expect(result.data.balanceRisk).toBe('High fall risk');
            expect(result.data.recommendations).toContain('Recommend supervision for all transfers');
        });

        it('generates appropriate recommendations', async () => {
            const result = await agent.processData(testData);
            expect(result.data.recommendations).toBeDefined();
            expect(result.data.recommendations.length).toBeGreaterThan(0);
            expect(result.data.recommendations.some(r => r.includes('modifications'))).toBe(true);
        });
    });

    describe('formatting', () => {
        it('formats brief content correctly', async () => {
            const result = await agent.processData(testData);
            const formatted = agent.getFormattedContent(result, 'brief');
            
            expect(formatted).toContain('modified independent');
            expect(formatted).toContain('Low fall risk');
        });

        it('formats standard content correctly', async () => {
            const result = await agent.processData(testData);
            const formatted = agent.getFormattedContent(result, 'standard');
            
            expect(formatted).toContain('Transfer Status:');
            expect(formatted).toContain('Balance Assessment:');
            expect(formatted).toContain('Recommendations:');
            expect(formatted).toContain('bed rail');
        });

        it('formats detailed content correctly', async () => {
            const result = await agent.processData(testData);
            const formatted = agent.getFormattedContent(result, 'detailed');
            
            expect(formatted).toContain('TRANSFER AND MOBILITY ASSESSMENT');
            expect(formatted).toContain('BALANCE ASSESSMENT');
            expect(formatted).toContain('RECOMMENDATIONS');
            expect(formatted).toContain('Independence Level:');
            expect(formatted).toContain('Modifications:');
        });

        it('handles minimal data gracefully', async () => {
            const minimalData = {
                ...testData,
                functionalAssessment: {
                    transfers: {},
                    bergBalance: null
                },
                adl: {
                    transfers: {
                        independence: 'independent'
                    }
                }
            };

            const result = await agent.processData(minimalData);
            const formatted = agent.getFormattedContent(result, 'standard');
            expect(formatted).toContain('Transfer Status:');
            expect(formatted).not.toContain('undefined');
        });
    });
});