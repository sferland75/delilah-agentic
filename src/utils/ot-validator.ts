import { DataSanitizer } from './data-sanitizer';

export class OTValidator {
    /**
     * Validate functional independence rating
     */
    static isValidIndependenceRating(rating: string): boolean {
        const validRatings = [
            'independent',
            'modified independent',
            'supervision',
            'minimum assistance',
            'moderate assistance',
            'maximum assistance',
            'dependent',
            'not tested'
        ];
        return validRatings.includes(rating.toLowerCase().trim());
    }

    /**
     * Validate functional tolerance duration
     */
    static isValidToleranceDuration(duration: string): boolean {
        const pattern = /^(?:\d{1,3})(?:\s*(?:minutes?|mins?|hours?|hrs?))?$/i;
        const cleanDuration = DataSanitizer.cleanText(duration);
        
        if (!pattern.test(cleanDuration)) return false;

        const value = parseInt(cleanDuration);
        return value > 0 && value <= 480; // Max 8 hours
    }

    /**
     * Validate activity frequency
     */
    static isValidActivityFrequency(frequency: string): boolean {
        const validFrequencies = [
            'daily',
            'weekly',
            'monthly',
            'twice daily',
            'three times per week',
            'as needed',
            'rarely',
            'occasionally',
            'frequently',
            'constant'
        ];
        return validFrequencies.includes(frequency.toLowerCase().trim());
    }

    /**
     * Validate assistance level
     */
    static isValidAssistanceLevel(level: string): boolean {
        const validLevels = [
            'no assistance',
            'setup only',
            'supervision',
            'minimal assistance',
            'moderate assistance',
            'maximum assistance',
            'total assistance',
            'not applicable'
        ];
        return validLevels.includes(level.toLowerCase().trim());
    }

    /**
     * Validate safety risk level
     */
    static isValidSafetyRisk(risk: string): boolean {
        const validRisks = [
            'no risk',
            'minimal risk',
            'moderate risk',
            'high risk',
            'severe risk',
            'not assessed'
        ];
        return validRisks.includes(risk.toLowerCase().trim());
    }

    /**
     * Normalize independence rating
     */
    static normalizeIndependenceRating(rating: string): string {
        if (!this.isValidIndependenceRating(rating)) return '';
        return rating.toLowerCase().trim();
    }

    /**
     * Normalize tolerance duration
     */
    static normalizeToleranceDuration(duration: string): string {
        if (!this.isValidToleranceDuration(duration)) return '';
        const value = parseInt(duration);
        return value > 60 ? `${value/60} hours` : `${value} minutes`;
    }

    /**
     * Normalize activity frequency
     */
    static normalizeActivityFrequency(frequency: string): string {
        if (!this.isValidActivityFrequency(frequency)) return '';
        return frequency.toLowerCase().trim();
    }

    /**
     * Normalize assistance level
     */
    static normalizeAssistanceLevel(level: string): string {
        if (!this.isValidAssistanceLevel(level)) return '';
        return level.toLowerCase().trim();
    }

    /**
     * Normalize safety risk
     */
    static normalizeSafetyRisk(risk: string): string {
        if (!this.isValidSafetyRisk(risk)) return '';
        return risk.toLowerCase().trim();
    }
}
