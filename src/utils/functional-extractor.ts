import { DataSanitizer } from './data-sanitizer';
import { OTValidator } from './ot-validator';
import { ErrorReporter, ValidationError } from './error-reporter';

export class FunctionalExtractor {
    private content: string;
    private errorReporter: ErrorReporter;

    constructor(content: string, errorReporter: ErrorReporter) {
        this.content = content;
        this.errorReporter = errorReporter;
    }

    public extractFunctionalStatus() {
        try {
            const toleranceSection = this.extractSection('Tolerances, Mobility and Transfers:', 'Active Range of Motion:');
            const romSection = this.extractSection('Active Range of Motion:', 'Emotional Presentation:');

            return {
                tolerances: this.extractTolerances(toleranceSection),
                transfers: this.extractTransfers(toleranceSection),
                mobility: this.extractMobility(toleranceSection),
                rom: this.extractROM(romSection)
            };
        } catch (error) {
            this.errorReporter.addError({
                field: 'functionalStatus',
                value: 'extraction',
                error: `Error extracting functional status: ${error instanceof Error ? error.message : 'Unknown error'}`,
                section: 'Functional Status'
            });
            throw error;
        }
    }

    private extractTolerances(text: string) {
        try {
            const sittingMatch = text.match(/Sitting[^\n]*?\n(.*?)(?=\n\n)/s);
            const standingMatch = text.match(/Standing[^\n]*?\n(.*?)(?=\n\n)/s);
            const walkingMatch = text.match(/Walking[^\n]*?\n(.*?)(?=\n\n)/s);
            const liftingMatch = text.match(/Lifting\/Carrying[^\n]*?\n(.*?)(?=\n\n)/s);

            return {
                sitting: DataSanitizer.cleanText(sittingMatch?.[1] || ''),
                standing: DataSanitizer.cleanText(standingMatch?.[1] || ''),
                walking: DataSanitizer.cleanText(walkingMatch?.[1] || ''),
                lifting: DataSanitizer.cleanText(liftingMatch?.[1] || '')
            };
        } catch (error) {
            this.errorReporter.addError({
                field: 'tolerances',
                value: 'extraction',
                error: `Error extracting tolerances: ${error instanceof Error ? error.message : 'Unknown error'}`,
                section: 'Functional Status'
            });
            return {
                sitting: '',
                standing: '',
                walking: '',
                lifting: ''
            };
        }
    }

    private extractTransfers(text: string) {
        try {
            const bedMatch = text.match(/Bed[^\n]*?\n(.*?)(?=\n\n)/s);
            const toiletMatch = text.match(/Toilet[^\n]*?\n(.*?)(?=\n\n)/s);
            const tubMatch = text.match(/Bathtub[^\n]*?\n(.*?)(?=\n\n)/s);
            const chairMatch = text.match(/Chair[^\n]*?\n(.*?)(?=\n\n)/s);
            const vehicleMatch = text.match(/Vehicle[^\n]*?\n(.*?)(?=\n\n)/s);

            return {
                bed: DataSanitizer.cleanText(bedMatch?.[1] || ''),
                toilet: DataSanitizer.cleanText(toiletMatch?.[1] || ''),
                tub: DataSanitizer.cleanText(tubMatch?.[1] || ''),
                chair: DataSanitizer.cleanText(chairMatch?.[1] || ''),
                vehicle: DataSanitizer.cleanText(vehicleMatch?.[1] || '')
            };
        } catch (error) {
            this.errorReporter.addError({
                field: 'transfers',
                value: 'extraction',
                error: `Error extracting transfers: ${error instanceof Error ? error.message : 'Unknown error'}`,
                section: 'Functional Status'
            });
            return {
                bed: '',
                toilet: '',
                tub: '',
                chair: '',
                vehicle: ''
            };
        }
    }

    private extractMobility(text: string) {
        try {
            const indoorsMatch = text.match(/Walking[^\n]*?\n(.*?)(?=\n\n)/s);
            const outdoorsMatch = text.match(/Walking[^\n]*?\n(.*?)(?=\n\n)/s);
            const stairsMatch = text.match(/Stairs[^\n]*?\n(.*?)(?=\n\n)/s);
            const balanceMatch = text.match(/Balance[^\n]*?\n(.*?)(?=\n\n)/s);

            return {
                indoors: DataSanitizer.cleanText(indoorsMatch?.[1] || ''),
                outdoors: DataSanitizer.cleanText(outdoorsMatch?.[1] || ''),
                stairs: DataSanitizer.cleanText(stairsMatch?.[1] || ''),
                balance: DataSanitizer.cleanText(balanceMatch?.[1] || '')
            };
        } catch (error) {
            this.errorReporter.addError({
                field: 'mobility',
                value: 'extraction',
                error: `Error extracting mobility: ${error instanceof Error ? error.message : 'Unknown error'}`,
                section: 'Functional Status'
            });
            return {
                indoors: '',
                outdoors: '',
                stairs: '',
                balance: ''
            };
        }
    }

    private extractROM(text: string) {
        try {
            const rows = text.split('\n')
                .filter(line => line.includes('|'))
                .map(line => line.split('|').map(cell => cell.trim()));

            const romData = [];
            
            for (const row of rows) {
                if (row.length >= 5) {
                    const [joint, movement, right, left, comments] = row;
                    if (joint && movement) {
                        romData.push({
                            joint: DataSanitizer.cleanText(joint),
                            movement: DataSanitizer.cleanText(movement),
                            rightROM: DataSanitizer.cleanText(right),
                            leftROM: DataSanitizer.cleanText(left),
                            comments: DataSanitizer.cleanText(comments)
                        });
                    }
                }
            }

            return romData;
        } catch (error) {
            this.errorReporter.addError({
                field: 'rom',
                value: 'extraction',
                error: `Error extracting ROM: ${error instanceof Error ? error.message : 'Unknown error'}`,
                section: 'Functional Status'
            });
            return [];
        }
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
