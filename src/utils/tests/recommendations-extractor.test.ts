import { RecommendationsExtractor } from '../recommendations-extractor';
import { ErrorReporter } from '../error-reporter';

describe('RecommendationsExtractor', () => {
    const sampleRecommendationsSection = `
        **RECOMMENDATIONS:**

        Attendant Care:
        Client is in need of 31.4 hours per week of Attendant Care services.
        Total monthly attendant care benefit: $2025.27/mth.

        Housekeeping:
        Client requires approximately 3 hours per week of housekeeping assistance to maintain:
        - Kitchen cleaning
        - Bathroom maintenance
        - Vacuuming and mopping
        - Laundry management

        Assistive Devices:
        The following equipment is recommended:
        - Transfer tub bench
        - Raised toilet seat
        - Reacher/grabber
        - Non-slip bath mat

        Further Occupational Therapy Interventions:
        - Bi-weekly OT sessions for 3 months
        - Weekly rehabilitation assistant support
        - ADL retraining program
        - Home safety assessment

        Referral for Other Services:
        - Physiotherapy
        - Kinesiology
        - Psychological support
    `;

    let errorReporter: ErrorReporter;
    let extractor: RecommendationsExtractor;

    beforeEach(() => {
        errorReporter = new ErrorReporter();
        extractor = new RecommendationsExtractor(sampleRecommendationsSection, errorReporter);
    });

    describe('Attendant Care Extraction', () => {
        test('extracts attendant care hours correctly', () => {
            const result = extractor.extractRecommendations();
            
            expect(result.attendantCare).toBeDefined();
            expect(result.attendantCare?.hoursPerWeek).toBe(31.4);
            expect(result.attendantCare?.monthlyBenefit).toBe(2025.27);
        });

        test('handles missing attendant care section', () => {
            const missingSection = sampleRecommendationsSection.replace(/Attendant Care:.*?Housekeeping:/s, 'Housekeeping:');
            const invalidExtractor = new RecommendationsExtractor(missingSection, errorReporter);
            const result = invalidExtractor.extractRecommendations();

            expect(result.attendantCare).toBeUndefined();
        });

        test('validates attendant care values', () => {
            const invalidValues = sampleRecommendationsSection.replace('31.4', 'invalid');
            const invalidExtractor = new RecommendationsExtractor(invalidValues, errorReporter);
            const result = invalidExtractor.extractRecommendations();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(errorReporter.getErrors()).toContainEqual(
                expect.objectContaining({
                    section: 'Recommendations',
                    field: 'attendantCare',
                    error: expect.stringContaining('Invalid hours value')
                })
            );
        });
    });

    describe('Housekeeping Extraction', () => {
        test('extracts housekeeping hours correctly', () => {
            const result = extractor.extractRecommendations();
            
            expect(result.housekeeping).toBeDefined();
            expect(result.housekeeping?.hoursPerWeek).toBe(3);
        });

        test('extracts housekeeping tasks correctly', () => {
            const result = extractor.extractRecommendations();
            
            expect(result.housekeeping?.tasks).toContain('Kitchen cleaning');
            expect(result.housekeeping?.tasks).toContain('Bathroom maintenance');
            expect(result.housekeeping?.tasks).toContain('Vacuuming and mopping');
            expect(result.housekeeping?.tasks).toContain('Laundry management');
        });
    });

    describe('Equipment Extraction', () => {
        test('extracts equipment recommendations correctly', () => {
            const result = extractor.extractRecommendations();
            
            expect(result.equipment).toBeDefined();
            expect(result.equipment).toContain('Transfer tub bench');
            expect(result.equipment).toContain('Raised toilet seat');
            expect(result.equipment).toContain('Reacher/grabber');
            expect(result.equipment).toContain('Non-slip bath mat');
        });

        test('handles missing equipment section', () => {
            const missingSection = sampleRecommendationsSection.replace(/Assistive Devices:.*?Further/s, 'Further');
            const invalidExtractor = new RecommendationsExtractor(missingSection, errorReporter);
            const result = invalidExtractor.extractRecommendations();

            expect(result.equipment).toBeUndefined();
        });
    });

    describe('Therapy Extraction', () => {
        test('extracts therapy recommendations correctly', () => {
            const result = extractor.extractRecommendations();
            
            expect(result.therapy).toBeDefined();
            expect(result.therapy).toContain('Bi-weekly OT sessions for 3 months');
            expect(result.therapy).toContain('Weekly rehabilitation assistant support');
            expect(result.therapy).toContain('ADL retraining program');
            expect(result.therapy).toContain('Home safety assessment');
        });

        test('validates therapy frequency formats', () => {
            const invalidFrequency = sampleRecommendationsSection.replace('Bi-weekly', 'Invalid frequency');
            const invalidExtractor = new RecommendationsExtractor(invalidFrequency, errorReporter);
            const result = invalidExtractor.extractRecommendations();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(errorReporter.getErrors()).toContainEqual(
                expect.objectContaining({
                    section: 'Recommendations',
                    field: 'therapy',
                    error: expect.stringContaining('Invalid therapy frequency')
                })
            );
        });
    });

    describe('Error Handling', () => {
        test('handles missing sections gracefully', () => {
            const incompleteSection = 'Incomplete content without proper sections';
            const invalidExtractor = new RecommendationsExtractor(incompleteSection, errorReporter);
            const result = invalidExtractor.extractRecommendations();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(result).toEqual({});
        });

        test('validates numeric values', () => {
            const invalidNumbers = sampleRecommendationsSection.replace(/\d+\.\d+/g, 'invalid');
            const invalidExtractor = new RecommendationsExtractor(invalidNumbers, errorReporter);
            const result = invalidExtractor.extractRecommendations();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(errorReporter.getErrors()).toContainEqual(
                expect.objectContaining({
                    section: 'Recommendations',
                    error: expect.stringContaining('Invalid numeric value')
                })
            );
        });
    });

    describe('Format Validation', () => {
        test('validates currency format', () => {
            const invalidCurrency = sampleRecommendationsSection.replace('$2025.27', '2025.27');
            const invalidExtractor = new RecommendationsExtractor(invalidCurrency, errorReporter);
            const result = invalidExtractor.extractRecommendations();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(errorReporter.getErrors()).toContainEqual(
                expect.objectContaining({
                    section: 'Recommendations',
                    field: 'currency',
                    error: expect.stringContaining('Invalid currency format')
                })
            );
        });

        test('validates time unit format', () => {
            const invalidTime = sampleRecommendationsSection.replace('per week', 'invalid');
            const invalidExtractor = new RecommendationsExtractor(invalidTime, errorReporter);
            const result = invalidExtractor.extractRecommendations();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(errorReporter.getErrors()).toContainEqual(
                expect.objectContaining({
                    section: 'Recommendations',
                    field: 'timeUnit',
                    error: expect.stringContaining('Invalid time unit')
                })
            );
        });
    });
});
