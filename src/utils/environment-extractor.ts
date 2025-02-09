import { DataSanitizer } from './data-sanitizer';
import { ErrorReporter, ValidationError } from './error-reporter';

export class EnvironmentExtractor {
    private content: string;
    private errorReporter: ErrorReporter;

    constructor(content: string, errorReporter: ErrorReporter) {
        this.content = content;
        this.errorReporter = errorReporter;
    }

    public extractEnvironment() {
        try {
            const environmentSection = this.extractSection('ENVIRONMENTAL ASSESSMENT:', 'LIVING ARRANGEMENTS');

            return {
                type: this.extractDwellingType(environmentSection),
                rooms: this.extractRooms(environmentSection),
                accessibility: this.extractAccessibility(environmentSection)
            };
        } catch (error) {
            this.errorReporter.addError({
                field: 'environment',
                value: 'extraction',
                error: `Error extracting environment: ${error instanceof Error ? error.message : 'Unknown error'}`,
                section: 'Environment'
            });
            throw error;
        }
    }

    private extractDwellingType(text: string): string {
        try {
            const typeMatch = text.match(/TYPE OF DWELLING[^\n]*?\n(.*?)(?=\n)/s);
            return DataSanitizer.cleanText(typeMatch?.[1] || '');
        } catch (error) {
            this.errorReporter.addError({
                field: 'dwellingType',
                value: 'extraction',
                error: `Error extracting dwelling type: ${error instanceof Error ? error.message : 'Unknown error'}`,
                section: 'Environment'
            });
            return '';
        }
    }

    private extractRooms(text: string): Array<{
        name: string;
        quantity: number;
        location: string;
        flooring: string;
    }> {
        try {
            const rooms = [];
            const roomsTable = text.match(/ROOMS.*?(?=Driveway Description)/s)?.[0] || '';
            
            const rows = roomsTable.split('\n')
                .filter(line => line.includes('|'))
                .map(line => line.split('|').map(cell => cell.trim()));

            for (const row of rows) {
                if (row.length >= 4) {
                    const [name, qty, location, flooring] = row;
                    if (name && !name.includes('ROOMS')) {
                        rooms.push({
                            name: DataSanitizer.cleanText(name),
                            quantity: parseInt(qty) || 0,
                            location: DataSanitizer.cleanText(location),
                            flooring: DataSanitizer.cleanText(flooring)
                        });
                    }
                }
            }

            return rooms;
        } catch (error) {
            this.errorReporter.addError({
                field: 'rooms',
                value: 'extraction',
                error: `Error extracting rooms: ${error instanceof Error ? error.message : 'Unknown error'}`,
                section: 'Environment'
            });
            return [];
        }
    }

    private extractAccessibility(text: string): {
        entrance: string;
        stairs: string;
        bathroom: string;
        bedroom: string;
    } {
        try {
            const entranceMatch = text.match(/entrance.*?\n(.*?)(?=\n\n)/s);
            const stairsMatch = text.match(/Stairs.*?\n(.*?)(?=\n\n)/s);
            const bathroomMatch = text.match(/Bathroom.*?\n(.*?)(?=\n\n)/s);
            const bedroomMatch = text.match(/Bedroom.*?\n(.*?)(?=\n\n)/s);

            return {
                entrance: DataSanitizer.cleanText(entranceMatch?.[1] || ''),
                stairs: DataSanitizer.cleanText(stairsMatch?.[1] || ''),
                bathroom: DataSanitizer.cleanText(bathroomMatch?.[1] || ''),
                bedroom: DataSanitizer.cleanText(bedroomMatch?.[1] || '')
            };
        } catch (error) {
            this.errorReporter.addError({
                field: 'accessibility',
                value: 'extraction',
                error: `Error extracting accessibility: ${error instanceof Error ? error.message : 'Unknown error'}`,
                section: 'Environment'
            });
            return {
                entrance: '',
                stairs: '',
                bathroom: '',
                bedroom: ''
            };
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
