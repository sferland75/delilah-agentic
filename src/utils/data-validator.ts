export class DataValidator {
    /**
     * Validate time format (HH:MM)
     */
    static isValidTime(time: string): boolean {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(time.trim());
    }

    /**
     * Validate date format (YYYY-MM-DD)
     */
    static isValidDate(date: string): boolean {
        const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        if (!dateRegex.test(date.trim())) return false;

        const [year, month, day] = date.split('-').map(Number);
        const testDate = new Date(year, month - 1, day);
        return testDate.getFullYear() === year &&
               testDate.getMonth() === month - 1 &&
               testDate.getDate() === day;
    }

    /**
     * Validate percentage format (X% or X.X%)
     */
    static isValidPercentage(percentage: string): boolean {
        const percentageRegex = /^(\d{1,3}(\.\d{1,2})?%?)$/;
        const value = parseFloat(percentage);
        return percentageRegex.test(percentage.trim()) && value >= 0 && value <= 100;
    }

    /**
     * Validate duration format (X.X or X hours/mins)
     */
    static isValidDuration(duration: string): boolean {
        const durationRegex = /^(\d{1,3}(\.\d{1,2})?\s*(hours?|mins?|minutes?)?)|(\d{1,2}:\d{2})$/i;
        return durationRegex.test(duration.trim());
    }

    /**
     * Validate frequency format (Daily, Weekly, Monthly, etc.)
     */
    static isValidFrequency(frequency: string): boolean {
        const validFrequencies = [
            'daily', 'weekly', 'monthly', 'yearly',
            'bid', 'tid', 'qid', 'prn',
            'every other day', 'twice daily', 'as needed'
        ];
        return validFrequencies.includes(frequency.toLowerCase().trim());
    }

    /**
     * Validate ROM measurement format (X° or X degrees)
     */
    static isValidROM(rom: string): boolean {
        const romRegex = /^(\d{1,3}(\.\d{1,2})?°?\s*degrees?)|(\d{1,3}(\.\d{1,2})?°)$/i;
        const value = parseFloat(rom);
        return romRegex.test(rom.trim()) && value >= 0 && value <= 360;
    }

    /**
     * Normalize time string to HH:MM format
     */
    static normalizeTime(time: string): string {
        const trimmed = time.trim();
        if (!this.isValidTime(trimmed)) return '';

        const [hours, minutes] = trimmed.split(':');
        return `${hours.padStart(2, '0')}:${minutes}`;
    }

    /**
     * Normalize date string to YYYY-MM-DD format
     */
    static normalizeDate(date: string): string {
        if (!this.isValidDate(date)) return '';
        return date.trim();
    }

    /**
     * Normalize percentage to X% format
     */
    static normalizePercentage(percentage: string): string {
        const trimmed = percentage.trim();
        if (!this.isValidPercentage(trimmed)) return '';

        const value = parseFloat(trimmed);
        return `${value}%`;
    }

    /**
     * Normalize duration to standard format
     */
    static normalizeDuration(duration: string): string {
        const trimmed = duration.trim().toLowerCase();
        if (!this.isValidDuration(trimmed)) return '';

        // Handle HH:MM format
        if (trimmed.includes(':')) {
            return trimmed;
        }

        // Handle numeric hours/minutes
        const value = parseFloat(trimmed);
        if (trimmed.includes('hour')) {
            return `${value} hours`;
        } else if (trimmed.includes('min')) {
            return `${value} mins`;
        }

        return `${value} hours`;
    }

    /**
     * Normalize frequency to standard format
     */
    static normalizeFrequency(frequency: string): string {
        const trimmed = frequency.trim().toLowerCase();
        if (!this.isValidFrequency(trimmed)) return '';

        const frequencyMap: { [key: string]: string } = {
            'bid': 'Twice Daily',
            'tid': 'Three Times Daily',
            'qid': 'Four Times Daily',
            'prn': 'As Needed'
        };

        return frequencyMap[trimmed] || 
               trimmed.split(' ')
                     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                     .join(' ');
    }

    /**
     * Normalize ROM measurement to X° format
     */
    static normalizeROM(rom: string): string {
        const trimmed = rom.trim();
        if (!this.isValidROM(trimmed)) return '';

        const value = parseFloat(trimmed);
        return `${value}°`;
    }
}
