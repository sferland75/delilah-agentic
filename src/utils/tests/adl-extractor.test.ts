import { ADLExtractor } from '../adl-extractor';
import { ErrorReporter } from '../error-reporter';

describe('ADLExtractor', () => {
    const sampleADLSection = `
        **ACTIVITIES OF DAILY LIVING**

        Prior to the subject MVA, client was independent in all self-care activities including dressing, grooming, and bathing.

        At the time of this assessment, client requires assistance with lower body dressing, particularly socks and shoes. 
        Grooming and hygiene remain independent but require increased time and modified techniques.

        **Home Management Activities:**

        Task | Pre-accident Engagement | Current Engagement
        Meal Preparation | Independent | Requires assistance with meal prep, manages only microwave meals
        Dishwashing | Independent | Unable - lacks standing tolerance
        Groceries | Independent | Requires assistance for shopping and carrying
        Bathroom cleaning | Independent | Unable due to bending restrictions
        Laundry | Independent | Unable to manage stairs to basement laundry
        Tidying | Independent | Limited to light tidying, no prolonged activity

        Time allotted: 16.85 hours per week

        **Leisure Activities:**

        Prior to the accident, client engaged in:
        - Regular soccer games
        - Swimming twice weekly
        - Social outings with friends
        - Working on car projects

        At the time of this assessment:
        - Unable to participate in any sports
        - Limited to watching TV
        - Occasional short walks when pain permits

        **Vocational Activities:**

        Pre-accident Employment Status:
        Status: Full-time employed
        Employer: City Transit
        Hours: 40 hours/week
        Duties: Bus operator, route scheduling

        Current Employment Status:
        Status: Off work
        Changes: Unable to sit for extended periods
        Limitations: Cannot manage required physical demands
    `;

    let errorReporter: ErrorReporter;
    let extractor: ADLExtractor;

    beforeEach(() => {
        errorReporter = new ErrorReporter();
        extractor = new ADLExtractor(sampleADLSection, errorReporter);
    });

    describe('Self-Care Extraction', () => {
        test('extracts pre-accident self-care status correctly', () => {
            const result = extractor.extractADL();
            
            expect(result.selfCare.preAccident).toContain('independent in all self-care activities');
            expect(result.selfCare.preAccident).toContain('dressing, grooming, and bathing');
        });

        test('extracts current self-care status correctly', () => {
            const result = extractor.extractADL();
            
            expect(result.selfCare.current).toContain('requires assistance with lower body dressing');
            expect(result.selfCare.current).toContain('increased time and modified techniques');
        });
    });

    describe('Home Management Extraction', () => {
        test('extracts home management tasks correctly', () => {
            const result = extractor.extractADL();
            
            expect(result.homeManagement).toContainEqual({
                task: 'Meal Preparation',
                preAccident: 'Independent',
                current: 'Requires assistance with meal prep, manages only microwave meals'
            });

            expect(result.homeManagement).toContainEqual({
                task: 'Laundry',
                preAccident: 'Independent',
                current: 'Unable to manage stairs to basement laundry'
            });
        });

        test('extracts time allocation correctly', () => {
            const result = extractor.extractADL();
            const mealPrepTask = result.homeManagement.find(task => task.task === 'Meal Preparation');
            
            expect(mealPrepTask?.timeAllotted).toBeDefined();
        });
    });

    describe('Leisure Activities Extraction', () => {
        test('extracts pre-accident leisure activities correctly', () => {
            const result = extractor.extractADL();
            
            expect(result.leisure.preAccident).toContain('Regular soccer games');
            expect(result.leisure.preAccident).toContain('Swimming twice weekly');
            expect(result.leisure.preAccident).toContain('Social outings with friends');
        });

        test('extracts current leisure activities correctly', () => {
            const result = extractor.extractADL();
            
            expect(result.leisure.current).toContain('Unable to participate in any sports');
            expect(result.leisure.current).toContain('Limited to watching TV');
        });
    });

    describe('Vocational Activities Extraction', () => {
        test('extracts pre-accident work status correctly', () => {
            const result = extractor.extractADL();
            
            expect(result.work.preAccident).toEqual({
                status: 'Full-time employed',
                employer: 'City Transit',
                hours: '40 hours/week',
                duties: 'Bus operator, route scheduling'
            });
        });

        test('extracts current work status correctly', () => {
            const result = extractor.extractADL();
            
            expect(result.work.current).toEqual({
                status: 'Off work',
                changes: 'Unable to sit for extended periods',
                limitations: 'Cannot manage required physical demands'
            });
        });
    });

    describe('Error Handling', () => {
        test('handles missing sections gracefully', () => {
            const incompleteSection = 'Incomplete content without proper sections';
            const invalidExtractor = new ADLExtractor(incompleteSection, errorReporter);
            const result = invalidExtractor.extractADL();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(result.selfCare).toEqual({
                preAccident: '',
                current: ''
            });
        });

        test('handles malformed table data', () => {
            const badTableSection = sampleADLSection.replace(/\|/g, ' ');
            const invalidExtractor = new ADLExtractor(badTableSection, errorReporter);
            const result = invalidExtractor.extractADL();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(result.homeManagement).toEqual([]);
        });
    });

    describe('Data Validation', () => {
        test('validates independence ratings', () => {
            const invalidRatingSection = sampleADLSection.replace('Independent', 'Invalid Rating');
            const invalidExtractor = new ADLExtractor(invalidRatingSection, errorReporter);
            const result = invalidExtractor.extractADL();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(errorReporter.getErrors()).toContainEqual(
                expect.objectContaining({
                    section: 'ADL',
                    field: 'independence',
                    error: expect.stringContaining('Invalid independence rating')
                })
            );
        });

        test('validates time allocations', () => {
            const invalidTimeSection = sampleADLSection.replace('16.85 hours', 'invalid time');
            const invalidExtractor = new ADLExtractor(invalidTimeSection, errorReporter);
            const result = invalidExtractor.extractADL();

            expect(errorReporter.hasErrors()).toBe(true);
            expect(errorReporter.getErrors()).toContainEqual(
                expect.objectContaining({
                    section: 'ADL',
                    field: 'timeAllotted',
                    error: expect.stringContaining('Invalid time allocation')
                })
            );
        });
    });
});
