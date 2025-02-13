import { DemographicsAgent } from '../DemographicsAgent';
import { createMockContext } from '../../testing/mockData';
import { Assessment } from '../../../../types/report';

describe('DemographicsAgent', () => {
    const agent = new DemographicsAgent(createMockContext());

    const testData: Assessment = {
        id: 'test-123',
        date: '2025-01-27',
        demographics: {
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1980-01-01',
            gender: 'Male',
            occupation: 'Construction Worker',
            maritalStatus: 'Married',
            emergencyContact: {
                name: 'Jane Doe',
                relationship: 'Spouse',
                phone: '555-0123'
            },
            residentialStatus: {
                type: 'Single Family Home',
                location: 'Suburban',
                accessibility: ['Ramp', 'Modified Bathroom']
            }
        }
    } as Assessment;

    describe('processData', () => {
        it('processes demographic data correctly', async () => {
            const result = await agent.processData(testData);
            expect(result.valid).toBe(true);
            expect(result.data.personal).toBeDefined();
            expect(result.data.emergency).toBeDefined();
            expect(result.data.residential).toBeDefined();
            expect(result.data.calculatedAge).toBeDefined();
        });

        it('calculates age correctly', async () => {
            const result = await agent.processData(testData);
            const expectedAge = new Date().getFullYear() - 1980;
            expect(result.data.calculatedAge).toBe(expectedAge);
        });

        it('handles missing data gracefully', async () => {
            const incompleteData = {
                ...testData,
                demographics: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };

            const result = await agent.processData(incompleteData);
            expect(result.valid).toBe(true);
            expect(result.data.calculatedAge).toBeUndefined();
            expect(result.data.emergency).toBeUndefined();
        });

        it('validates required fields', async () => {
            const invalidData = {
                ...testData,
                demographics: {
                    firstName: '', // Missing required field
                    lastName: 'Doe'
                }
            };

            const result = await agent.processData(invalidData);
            expect(result.valid).toBe(false);
            expect(result.error).toBeDefined();
        });
    });

    describe('formatting', () => {
        it('formats brief content correctly', async () => {
            const processed = await agent.processData(testData);
            const brief = agent.getFormattedContent(processed, 'brief');
            
            expect(brief).toContain('John Doe');
            expect(brief).toContain('Male');
            expect(brief).toContain('Construction Worker');
        });

        it('formats standard content correctly', async () => {
            const processed = await agent.processData(testData);
            const standard = agent.getFormattedContent(processed, 'standard');
            
            expect(standard).toContain('Personal Information:');
            expect(standard).toContain('Emergency Contact:');
            expect(standard).toContain('Residential Information:');
            expect(standard).toContain('Jane Doe');
            expect(standard).toContain('Single Family Home');
        });

        it('formats detailed content correctly', async () => {
            const processed = await agent.processData(testData);
            const detailed = agent.getFormattedContent(processed, 'detailed');
            
            expect(detailed).toContain('DEMOGRAPHIC ASSESSMENT');
            expect(detailed).toContain('PERSONAL INFORMATION');
            expect(detailed).toContain('EMERGENCY CONTACT');
            expect(detailed).toContain('RESIDENTIAL INFORMATION');
            expect(detailed).toContain('Accessibility Features:');
            expect(detailed).toContain('- Ramp');
        });

        it('handles minimal data gracefully', async () => {
            const minimalData = {
                ...testData,
                demographics: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };

            const processed = await agent.processData(minimalData);
            const formatted = agent.getFormattedContent(processed, 'standard');
            expect(formatted).toContain('John Doe');
            expect(formatted).not.toContain('undefined');
            expect(formatted).not.toContain('null');
        });
    });
});