import { FormatService } from '../FormatService';

describe('FormatService', () => {
    let formatter: FormatService;

    beforeEach(() => {
        formatter = new FormatService();
    });

    describe('Table Formatting', () => {
        it('formats medication data as table', () => {
            const medications = [
                {
                    name: 'Ibuprofen',
                    dosage: '400mg',
                    frequency: 'As needed',
                    purpose: 'Pain management'
                },
                {
                    name: 'Acetaminophen',
                    dosage: '500mg',
                    frequency: 'Twice daily',
                    purpose: 'Fever reduction'
                }
            ];

            const result = formatter.formatOutput('medications', medications, 'table');
            expect(result).toContain('Medication');
            expect(result).toContain('Dosage');
            expect(result).toContain('Ibuprofen');
            expect(result).toContain('400mg');
        });

        it('formats ADL data as table', () => {
            const adlData = [
                {
                    activity: 'Bathing',
                    independence: 'Modified Independent',
                    notes: 'Uses grab bars'
                },
                {
                    activity: 'Dressing',
                    independence: 'Independent',
                    notes: 'No assistance needed'
                }
            ];

            const result = formatter.formatOutput('adl', adlData, 'table');
            expect(result).toContain('Activity');
            expect(result).toContain('Level');
            expect(result).toContain('Bathing');
            expect(result).toContain('Modified Independent');
        });
    });

    describe('List Formatting', () => {
        it('formats simple items as list', () => {
            const items = [
                'First item',
                'Second item',
                'Third item'
            ];

            const result = formatter.formatOutput('genericList', items, 'list');
            expect(result).toContain('1. First item');
            expect(result).toContain('2. Second item');
            expect(result).toContain('3. Third item');
        });

        it('formats complex items as list', () => {
            const items = [
                { name: 'Item 1', description: 'Description 1' },
                { name: 'Item 2', description: 'Description 2' }
            ];

            const result = formatter.formatOutput('genericList', items, 'list');
            expect(result).toContain('Item 1 - Description 1');
            expect(result).toContain('Item 2 - Description 2');
        });
    });

    describe('Structured Formatting', () => {
        it('formats demographic data as structured', () => {
            const demographics = {
                firstName: 'John',
                lastName: 'Doe',
                address: {
                    street: '123 Main St',
                    city: 'Anytown'
                }
            };

            const result = formatter.formatOutput('demographics', demographics, 'structured');
            expect(result).toContain('First Name: John');
            expect(result).toContain('Last Name: Doe');
            expect(result).toContain('Street: 123 Main St');
        });

        it('handles nested objects', () => {
            const data = {
                mainCategory: {
                    subCategory: {
                        item: 'value'
                    }
                }
            };

            const result = formatter.formatOutput('generic', data, 'structured');
            expect(result).toContain('Main Category:');
            expect(result).toContain('    Sub Category:');
            expect(result).toContain('        Item: value');
        });
    });

    describe('Error Handling', () => {
        it('handles empty data', () => {
            expect(formatter.formatOutput('medications', [], 'table'))
                .toBe('No data available');
            expect(formatter.formatOutput('genericList', [], 'list'))
                .toBe('No items to display');
            expect(formatter.formatOutput('demographics', null, 'structured'))
                .toBe('No data available');
        });

        it('handles invalid data types', () => {
            expect(formatter.formatOutput('medications', 'invalid' as any, 'table'))
                .toBe('No data available');
            expect(formatter.formatOutput('demographics', [] as any, 'structured'))
                .toBe('No data available');
        });
    });
});