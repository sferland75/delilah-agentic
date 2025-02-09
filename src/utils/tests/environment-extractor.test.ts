import { EnvironmentExtractor } from '../environment-extractor';
import { ErrorReporter } from '../error-reporter';

describe('EnvironmentExtractor', () => {
    const sampleEnvironmentSection = `
        **ENVIRONMENTAL ASSESSMENT:**

        TYPE OF DWELLING: Two-story detached home

        ROOMS | Qty | LOCATION/DESCRIPTION | FLOOR COVERING
        Bedrooms | 3 | Second floor | Carpet
        Bathrooms | 2 | Main and second floor | Tile
        Living Room | 1 | Main floor | Hardwood
        Kitchen | 1 | Main floor | Tile
        Laundry | 1 | Basement | Concrete
        Stairs | Yes | Internal stairs between floors | Carpet

        Driveway Description: Double car width, paved
        Yard description: Large backyard, partially fenced

        Accessibility Notes:
        Entrance: Three steps to front door, no railing
        Stairs: 13 stairs to second floor with handrail on right
        Bathroom: Standard tub/shower combo, no grab bars
        Bedroom: Queen bed against wall limiting access
    `;

    let errorReporter: ErrorReporter;
    let extractor: EnvironmentExtractor;

    beforeEach(() => {
        errorReporter = new ErrorReporter();
        extractor = new EnvironmentExtractor(sampleEnvironmentSection, errorReporter);
    });

    describe('Dwelling Type Extraction', () => {
        test('extracts dwelling type correctly', () => {
            const result = extractor.extractEnvironment();
            
            expect(result.type).toBe('Two-story detached home');
        });

        test('handles missing dwelling type', () => {
            const missingType = sampleEnvironmentSection.replace('TYPE OF DWELLING:', '');
            const invalidExtractor = new EnvironmentExtractor(missingType, errorReporter);
            const result = invalidExtractor.extractEnvironment();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(result.type).toBe('');
        });
    });

    describe('Room Extraction', () => {
        test('extracts room details correctly', () => {
            const result = extractor.extractEnvironment();
            
            expect(result.rooms).toContainEqual({
                name: 'Bedrooms',
                quantity: 3,
                location: 'Second floor',
                flooring: 'Carpet'
            });

            expect(result.rooms).toContainEqual({
                name: 'Kitchen',
                quantity: 1,
                location: 'Main floor',
                flooring: 'Tile'
            });
        });

        test('validates room quantities', () => {
            const invalidQuantity = sampleEnvironmentSection.replace('3', 'invalid');
            const invalidExtractor = new EnvironmentExtractor(invalidQuantity, errorReporter);
            const result = invalidExtractor.extractEnvironment();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(errorReporter.getErrors()).toContainEqual(
                expect.objectContaining({
                    section: 'Environment',
                    field: 'rooms',
                    error: expect.stringContaining('Invalid room quantity')
                })
            );
        });
    });

    describe('Accessibility Extraction', () => {
        test('extracts accessibility details correctly', () => {
            const result = extractor.extractEnvironment();
            
            expect(result.accessibility.entrance).toContain('Three steps to front door');
            expect(result.accessibility.stairs).toContain('13 stairs');
            expect(result.accessibility.bathroom).toContain('no grab bars');
            expect(result.accessibility.bedroom).toContain('limiting access');
        });

        test('handles missing accessibility sections', () => {
            const missingAccess = sampleEnvironmentSection.replace('Accessibility Notes:', '');
            const invalidExtractor = new EnvironmentExtractor(missingAccess, errorReporter);
            const result = invalidExtractor.extractEnvironment();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(result.accessibility).toEqual({
                entrance: '',
                stairs: '',
                bathroom: '',
                bedroom: ''
            });
        });
    });

    describe('Error Handling', () => {
        test('handles missing sections gracefully', () => {
            const incompleteSection = 'Incomplete content without proper sections';
            const invalidExtractor = new EnvironmentExtractor(incompleteSection, errorReporter);
            const result = invalidExtractor.extractEnvironment();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(result.rooms).toEqual([]);
        });

        test('handles malformed table data', () => {
            const badTableSection = sampleEnvironmentSection.replace(/\|/g, ' ');
            const invalidExtractor = new EnvironmentExtractor(badTableSection, errorReporter);
            const result = invalidExtractor.extractEnvironment();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(result.rooms).toEqual([]);
        });
    });

    describe('Validation Rules', () => {
        test('validates flooring types', () => {
            const invalidFlooring = sampleEnvironmentSection.replace('Carpet', 'Invalid Floor');
            const invalidExtractor = new EnvironmentExtractor(invalidFlooring, errorReporter);
            const result = invalidExtractor.extractEnvironment();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(errorReporter.getErrors()).toContainEqual(
                expect.objectContaining({
                    section: 'Environment',
                    field: 'flooring',
                    error: expect.stringContaining('Invalid flooring type')
                })
            );
        });

        test('validates room locations', () => {
            const invalidLocation = sampleEnvironmentSection.replace('Main floor', 'Invalid Location');
            const invalidExtractor = new EnvironmentExtractor(invalidLocation, errorReporter);
            const result = invalidExtractor.extractEnvironment();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(errorReporter.getErrors()).toContainEqual(
                expect.objectContaining({
                    section: 'Environment',
                    field: 'location',
                    error: expect.stringContaining('Invalid room location')
                })
            );
        });
    });
});
