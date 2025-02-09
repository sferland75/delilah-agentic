import { DataValidator } from '../data-validator';

describe('DataValidator', () => {
    describe('Time Validation', () => {
        test('validates correct time formats', () => {
            expect(DataValidator.isValidTime('13:45')).toBe(true);
            expect(DataValidator.isValidTime('9:30')).toBe(true);
            expect(DataValidator.isValidTime('23:59')).toBe(true);
        });

        test('rejects invalid time formats', () => {
            expect(DataValidator.isValidTime('25:00')).toBe(false);
            expect(DataValidator.isValidTime('12:60')).toBe(false);
            expect(DataValidator.isValidTime('9:3')).toBe(false);
        });

        test('normalizes time format', () => {
            expect(DataValidator.normalizeTime('9:30')).toBe('09:30');
            expect(DataValidator.normalizeTime('13:45')).toBe('13:45');
            expect(DataValidator.normalizeTime('invalid')).toBe('');
        });
    });

    describe('Date Validation', () => {
        test('validates correct date formats', () => {
            expect(DataValidator.isValidDate('2025-02-08')).toBe(true);
            expect(DataValidator.isValidDate('2024-12-31')).toBe(true);
        });

        test('rejects invalid date formats', () => {
            expect(DataValidator.isValidDate('2025-13-01')).toBe(false);
            expect(DataValidator.isValidDate('2025-02-30')).toBe(false);
        });

        test('normalizes date format', () => {
            expect(DataValidator.normalizeDate('2025-02-08')).toBe('2025-02-08');
            expect(DataValidator.normalizeDate('invalid')).toBe('');
        });
    });

    describe('ROM Validation', () => {
        test('validates correct ROM formats', () => {
            expect(DataValidator.isValidROM('45°')).toBe(true);
            expect(DataValidator.isValidROM('90 degrees')).toBe(true);
            expect(DataValidator.isValidROM('180.5°')).toBe(true);
        });

        test('rejects invalid ROM formats', () => {
            expect(DataValidator.isValidROM('370°')).toBe(false);
            expect(DataValidator.isValidROM('-45°')).toBe(false);
            expect(DataValidator.isValidROM('invalid')).toBe(false);
        });

        test('normalizes ROM format', () => {
            expect(DataValidator.normalizeROM('45°')).toBe('45°');
            expect(DataValidator.normalizeROM('90 degrees')).toBe('90°');
            expect(DataValidator.normalizeROM('invalid')).toBe('');
        });
    });

    describe('Duration Validation', () => {
        test('validates correct duration formats', () => {
            expect(DataValidator.isValidDuration('30 mins')).toBe(true);
            expect(DataValidator.isValidDuration('2.5 hours')).toBe(true);
            expect(DataValidator.isValidDuration('1:30')).toBe(true);
        });

        test('rejects invalid duration formats', () => {
            expect(DataValidator.isValidDuration('-30 mins')).toBe(false);
            expect(DataValidator.isValidDuration('invalid')).toBe(false);
        });

        test('normalizes duration format', () => {
            expect(DataValidator.normalizeDuration('30 mins')).toBe('30 mins');
            expect(DataValidator.normalizeDuration('2.5 hours')).toBe('2.5 hours');
            expect(DataValidator.normalizeDuration('invalid')).toBe('');
        });
    });

    describe('Frequency Validation', () => {
        test('validates correct frequency formats', () => {
            expect(DataValidator.isValidFrequency('daily')).toBe(true);
            expect(DataValidator.isValidFrequency('BID')).toBe(true);
            expect(DataValidator.isValidFrequency('as needed')).toBe(true);
            expect(DataValidator.isValidFrequency('weekly')).toBe(true);
            expect(DataValidator.isValidFrequency('monthly')).toBe(true);
        });

        test('rejects invalid frequency formats', () => {
            expect(DataValidator.isValidFrequency('every minute')).toBe(false);
            expect(DataValidator.isValidFrequency('random')).toBe(false);
            expect(DataValidator.isValidFrequency('invalid')).toBe(false);
        });

        test('normalizes frequency format', () => {
            expect(DataValidator.normalizeFrequency('bid')).toBe('Twice Daily');
            expect(DataValidator.normalizeFrequency('daily')).toBe('Daily');
            expect(DataValidator.normalizeFrequency('as needed')).toBe('As Needed');
            expect(DataValidator.normalizeFrequency('invalid')).toBe('');
        });
    });

    describe('Percentage Validation', () => {
        test('validates correct percentage formats', () => {
            expect(DataValidator.isValidPercentage('45%')).toBe(true);
            expect(DataValidator.isValidPercentage('100%')).toBe(true);
            expect(DataValidator.isValidPercentage('0.5%')).toBe(true);
            expect(DataValidator.isValidPercentage('75')).toBe(true);
        });

        test('rejects invalid percentage formats', () => {
            expect(DataValidator.isValidPercentage('101%')).toBe(false);
            expect(DataValidator.isValidPercentage('-5%')).toBe(false);
            expect(DataValidator.isValidPercentage('invalid')).toBe(false);
        });

        test('normalizes percentage format', () => {
            expect(DataValidator.normalizePercentage('45%')).toBe('45%');
            expect(DataValidator.normalizePercentage('45')).toBe('45%');
            expect(DataValidator.normalizePercentage('invalid')).toBe('');
        });
    });

    describe('Edge Cases', () => {
        test('handles empty strings', () => {
            expect(DataValidator.isValidTime('')).toBe(false);
            expect(DataValidator.isValidDate('')).toBe(false);
            expect(DataValidator.isValidROM('')).toBe(false);
            expect(DataValidator.isValidDuration('')).toBe(false);
            expect(DataValidator.isValidFrequency('')).toBe(false);
            expect(DataValidator.isValidPercentage('')).toBe(false);
        });

        test('handles whitespace', () => {
            expect(DataValidator.normalizeTime('  13:45  ')).toBe('13:45');
            expect(DataValidator.normalizeDate('  2025-02-08  ')).toBe('2025-02-08');
            expect(DataValidator.normalizeROM('  45°  ')).toBe('45°');
        });
    });
});
