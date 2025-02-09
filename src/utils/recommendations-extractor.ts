import { DataSanitizer } from './data-sanitizer';
import { ErrorReporter, ValidationError } from './error-reporter';

export class RecommendationsExtractor {
    private content: string;
    private errorReporter: ErrorReporter;

    constructor(content: string, errorReporter: ErrorReporter) {
        this.content = content;
        this.errorReporter = errorReporter;
    }

    public extractRecommendations() {
        try {
            const recommendationsSection = this.extractSection('RECOMMENDATIONS:', 'CLOSING COMMENTS:');
            
            return {
                attendantCare: this.extractAttendantCare(recommendationsSection),
                housekeeping: this.extractHousekeeping(recommendationsSection),
                equipment: this.extractEquipment(recommendationsSection),
                therapy: this.extractTherapy(recommendationsSection)
            };
        } catch (error) {
            this.errorReporter.addError({
                field: 'recommendations',
                value: 'extraction',
                error: `Error extracting recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`,
                section: 'Recommendations'
            });
            throw error;
        }
    }

    private extractAttendantCare(text: string): {
        hoursPerWeek: number;
        monthlyBenefit: number;
    } | undefined {
        try {
            const attendantCareSection = this.extractSection('Attendant Care:', 'Housekeeping:');
            if (!attendantCareSection) return undefined;

            const hoursMatch = attendantCareSection.match(/(\d+(?:\.\d+)?)\s*hours?\s*per\s*week/i);
            const benefitMatch = attendantCareSection.match(/\$(\d+(?:\.\d+)?)/);

            if (!hoursMatch || !benefitMatch) return undefined;

            return {
                hoursPerWeek: parseFloat(hoursMatch[1]),
                monthlyBenefit: parseFloat(benefitMatch[1])
            };
        } catch (error) {
            this.errorReporter.addError({
                field: 'attendantCare',
                value: 'extraction',
                error: `Error extracting attendant care: ${error instanceof Error ? error.message : 'Unknown error'}`,
                section: 'Recommendations'
            });
            return undefined;
        }
    }

    private extractHousekeeping(text: string): {
        hoursPerWeek: number;
        tasks: string[];
    } | undefined {
        try {
            const housekeepingSection = this.extractSection('Housekeeping:', 'Assistive Devices:');
            if (!housekeepingSection) return undefined;

            const hoursMatch = housekeepingSection.match(/(\d+(?:\.\d+)?)\s*hours?\s*per\s*week/i);
            if (!hoursMatch) return undefined;

            return {
                hoursPerWeek: parseFloat(hoursMatch[1]),
                tasks: this.extractBulletPoints(housekeepingSection)
            };
        } catch (error) {
            this.errorReporter.addError({
                field: 'housekeeping',
                value: 'extraction',
                error: `Error extracting housekeeping: ${error instanceof Error ? error.message : 'Unknown error'}`,
                section: 'Recommendations'
            });
            return undefined;
        }
    }

    private extractEquipment(text: string): string[] | undefined {
        try {
            const equipmentSection = this.extractSection('Assistive Devices:', 'Further Occupational Therapy Interventions:');
            if (!equipmentSection) return undefined;

            return this.extractBulletPoints(equipmentSection);
        } catch (error) {
            this.errorReporter.addError({
                field: 'equipment',
                value: 'extraction',
                error: `Error extracting equipment: ${error instanceof Error ? error.message : 'Unknown error'}`,
                section: 'Recommendations'
            });
            return undefined;
        }
    }

    private extractTherapy(text: string): string[] | undefined {
        try {
            const therapySection = this.extractSection('Further Occupational Therapy Interventions:', 'Referral for Other Services:');
            if (!therapySection) return undefined;

            return this.extractBulletPoints(therapySection);
        } catch (error) {
            this.errorReporter.addError({
                field: 'therapy',
                value: 'extraction',
                error: `Error extracting therapy: ${error instanceof Error ? error.message : 'Unknown error'}`,
                section: 'Recommendations'
            });
            return undefined;
        }
    }

    private extractBulletPoints(text: string): string[] {
        return text
            .split(/[\n\r]+/)
            .map(line => DataSanitizer.cleanText(line.replace(/^[-•●\s]+/, '')))
            .filter(line => line.length > 0);
    }

    private extractSection(startMarker: string, endMarker: string): string {
        const startIndex = this.content.indexOf(startMarker);
        const endIndex = this.content.indexOf(endMarker);
        
        if (startIndex === -1) {
            this.errorReporter.addError({
                field: 'section',
                value: startMarker,
                error: 'Section start marker not found',
                section: 'Section Extraction'
            });
            return '';
        }
        if (endIndex === -1) {
            this.errorReporter.addError({
                field: 'section',
                value: endMarker,
                error: 'Section end marker not found',
                section: 'Section Extraction'
            });
            return '';
        }
        
        return this.content.slice(startIndex + startMarker.length, endIndex).trim();
    }
}
