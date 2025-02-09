import { FunctionalExtractor } from '../functional-extractor';
import { ErrorReporter } from '../error-reporter';

describe('FunctionalExtractor', () => {
    const sampleFunctionalSection = `
        **Tolerances, Mobility and Transfers:**

        Activity | Client Report and Therapist Observations
        Sitting and repositioning | Client reports 30 minute tolerance before requiring position change. Frequent shifting observed during assessment.
        Standing | Limited to 15 minutes before requiring rest. Notable increased pain with prolonged standing.
        Walking | Able to ambulate 100m before requiring rest. Uses single-point cane for all community mobility.
        Lifting/Carrying | Unable to manage loads exceeding 10 lbs. Requires assistance for groceries and laundry.

        **Active Range of Motion:**
        Movement | Right | Left | Comments
        Neck Flexion | WFL | WFL | Pain at end range
        Neck Extension | 75% | 75% | Increased pain
        Shoulder Flexion | WFL | 50% | Limited by pain
        Shoulder Abduction | WFL | 50% | Limited by pain
    `;

    let errorReporter: ErrorReporter;
    let extractor: FunctionalExtractor;

    beforeEach(() => {
        errorReporter = new ErrorReporter();
        extractor = new FunctionalExtractor(sampleFunctionalSection, errorReporter);
    });

    describe('Tolerance Extraction', () => {
        test('extracts sitting tolerance correctly', () => {
            const result = extractor.extractFunctionalStatus();
            
            expect(result.tolerances.sitting).toContain('30 minute tolerance');
            expect(result.tolerances.sitting).toContain('Frequent shifting');
        });

        test('extracts standing tolerance correctly', () => {
            const result = extractor.extractFunctionalStatus();
            
            expect(result.tolerances.standing).toContain('15 minutes');
            expect(result.tolerances.standing).toContain('Notable increased pain');
        });

        test('extracts walking tolerance correctly', () => {
            const result = extractor.extractFunctionalStatus();
            
            expect(result.tolerances.walking).toContain('100m');
            expect(result.tolerances.walking).toContain('single-point cane');
        });

        test('extracts lifting tolerance correctly', () => {
            const result = extractor.extractFunctionalStatus();
            
            expect(result.tolerances.lifting).toContain('10 lbs');
            expect(result.tolerances.lifting).toContain('assistance for groceries');
        });
    });

    describe('ROM Extraction', () => {
        test('extracts ROM measurements correctly', () => {
            const result = extractor.extractFunctionalStatus();
            
            expect(result.rom).toContainEqual({
                joint: 'Neck',
                movement: 'Flexion',
                rightROM: 'WFL',
                leftROM: 'WFL',
                comments: 'Pain at end range'
            });

            expect(result.rom).toContainEqual({
                joint: 'Shoulder',
                movement: 'Flexion',
                rightROM: 'WFL',
                leftROM: '50%',
                comments: 'Limited by pain'
            });
        });

        test('validates ROM values', () => {
            const invalidROMSection = sampleFunctionalSection.replace('WFL', 'Invalid');
            const invalidExtractor = new FunctionalExtractor(invalidROMSection, errorReporter);
            const result = invalidExtractor.extractFunctionalStatus();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(errorReporter.getErrors()).toContainEqual(
                expect.objectContaining({
                    section: 'Functional Status',
                    field: 'rom',
                    error: expect.stringContaining('Invalid ROM value')
                })
            );
        });
    });

    describe('Error Handling', () => {
        test('handles missing sections gracefully', () => {
            const incompleteSection = 'Incomplete content without proper sections';
            const invalidExtractor = new FunctionalExtractor(incompleteSection, errorReporter);
            const result = invalidExtractor.extractFunctionalStatus();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(result).toBeDefined();
            expect(result.tolerances).toEqual({
                sitting: '',
                standing: '',
                walking: '',
                lifting: ''
            });
        });

        test('handles malformed table data', () => {
            const badTableSection = sampleFunctionalSection.replace(/\|/g, ' ');
            const invalidExtractor = new FunctionalExtractor(badTableSection, errorReporter);
            const result = invalidExtractor.extractFunctionalStatus();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(result.rom).toEqual([]);
        });
    });

    describe('Data Validation', () => {
        test('validates time durations', () => {
            const invalidTimeSection = sampleFunctionalSection.replace('30 minute', 'invalid time');
            const invalidExtractor = new FunctionalExtractor(invalidTimeSection, errorReporter);
            const result = invalidExtractor.extractFunctionalStatus();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(errorReporter.getErrors()).toContainEqual(
                expect.objectContaining({
                    section: 'Functional Status',
                    field: 'tolerances',
                    error: expect.stringContaining('Invalid time duration')
                })
            );
        });

        test('validates distance measurements', () => {
            const invalidDistanceSection = sampleFunctionalSection.replace('100m', 'invalid distance');
            const invalidExtractor = new FunctionalExtractor(invalidDistanceSection, errorReporter);
            const result = invalidExtractor.extractFunctionalStatus();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(errorReporter.getErrors()).toContainEqual(
                expect.objectContaining({
                    section: 'Functional Status',
                    field: 'tolerances',
                    error: expect.stringContaining('Invalid distance measurement')
                })
            );
        });
    });
});
