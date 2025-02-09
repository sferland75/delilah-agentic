import { ErrorReporter } from './error-reporter';
import { DataSanitizer } from './data-sanitizer';
import { FunctionalAssessmentData } from '../types/assessment';

export class FunctionalAssessmentExtractor {
    private content: string;
    private errorReporter: ErrorReporter;

    constructor(content: string, errorReporter: ErrorReporter) {
        this.content = content;
        this.errorReporter = errorReporter;
    }

    public extract(): FunctionalAssessmentData {
        try {
            return {
                rangeOfMotion: this.extractROM(),
                manualMuscleTesting: this.extractMMT(),
                bergBalance: this.extractBergBalance(),
                posturalTolerances: this.extractPosturalTolerances(),
                transfers: this.extractTransfers(),
                capacities: this.extractCapacities(),
                overallNotes: this.extractOverallNotes(),
                recommendedAccommodations: this.extractAccommodations(),
                followUpNeeded: this.extractFollowUpNeeded()
            };
        } catch (error) {
            this.errorReporter.addError({
                field: 'functionalAssessment',
                value: 'extraction',
                error: `Error extracting functional assessment: ${error instanceof Error ? error.message : 'Unknown error'}`,
                section: 'Functional Assessment'
            });
            return this.getEmptyAssessment();
        }
    }

    private extractROM() {
        try {
            const romSection = this.extractSection('Active Range of Motion:', 'Emotional Presentation:');
            const measurements = [];
            
            const rows = romSection.split('\n')
                .filter(line => line.includes('|'))
                .map(line => line.split('|').map(cell => cell.trim()));

            for (const row of rows) {
                if (row.length >= 5 && !row[0].includes('Movement')) {  // Skip header
                    measurements.push({
                        joint: DataSanitizer.cleanText(row[0]),
                        movement: DataSanitizer.cleanText(row[1]),
                        rightROM: this.validateROMValue(row[2]),
                        leftROM: this.validateROMValue(row[3]),
                        comments: DataSanitizer.cleanText(row[4] || '')
                    });
                }
            }

            return {
                measurements,
                generalNotes: this.extractGeneralNotes(romSection)
            };
        } catch (error) {
            this.errorReporter.addError({
                field: 'rom',
                value: 'extraction',
                error: `Error extracting ROM: ${error instanceof Error ? error.message : 'Unknown error'}`,
                section: 'Functional Assessment'
            });
            return {
                measurements: [],
                generalNotes: ''
            };
        }
    }

    private extractMMT() {
        return {
            grades: {},
            generalNotes: ''
        };
    }

    private extractBergBalance() {
        return {
            items: {},
            generalNotes: '',
            totalScore: 0
        };
    }

    private extractPosturalTolerances() {
        try {
            const toleranceSection = this.extractSection('Tolerances, Mobility and Transfers:', 'Active Range of Motion:');
            return {
                sitting: this.extractToleranceValue(toleranceSection, 'Sitting'),
                standing: this.extractToleranceValue(toleranceSection, 'Standing'),
                walking: this.extractToleranceValue(toleranceSection, 'Walking'),
                lifting: this.extractToleranceValue(toleranceSection, 'Lifting/Carrying')
            };
        } catch (error) {
            this.errorReporter.addError({
                field: 'posturalTolerances',
                value: 'extraction',
                error: `Error extracting tolerances: ${error instanceof Error ? error.message : 'Unknown error'}`,
                section: 'Functional Assessment'
            });
            return {
                sitting: '',
                standing: '',
                walking: '',
                lifting: ''
            };
        }
    }

    private extractTransfers(): Record<string, string> {
        return {};
    }

    private extractCapacities(): Record<string, string> {
        return {};
    }

    private extractOverallNotes(): string {
        return '';
    }

    private extractAccommodations(): string[] {
        return [];
    }

    private extractFollowUpNeeded(): boolean {
        return false;
    }

    private validateROMValue(value: string): string {
        const normalized = value.trim().toUpperCase();
        if (normalized === 'WFL' || normalized.endsWith('%') || normalized === 'NOMINAL') {
            return normalized;
        }
        this.errorReporter.addError({
            field: 'rom',
            value,
            error: 'Invalid ROM value',
            section: 'Functional Assessment'
        });
        return '';
    }

    private extractToleranceValue(section: string, activity: string): string {
        const match = section.match(new RegExp(`${activity}[^\n]*\n([^\n]+)`));
        return DataSanitizer.cleanText(match?.[1] || '');
    }

    private extractGeneralNotes(section: string): string {
        const notesMatch = section.match(/Notes?:(.*?)(?=\n\n|\n[A-Z]|$)/s);
        return DataSanitizer.cleanText(notesMatch?.[1] || '');
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

    private getEmptyAssessment(): FunctionalAssessmentData {
        return {
            rangeOfMotion: { measurements: [], generalNotes: '' },
            manualMuscleTesting: { grades: {}, generalNotes: '' },
            bergBalance: { items: {}, generalNotes: '', totalScore: 0 },
            posturalTolerances: { sitting: '', standing: '', walking: '', lifting: '' },
            transfers: {},
            capacities: {},
            overallNotes: '',
            recommendedAccommodations: [],
            followUpNeeded: false
        };
    }
}
