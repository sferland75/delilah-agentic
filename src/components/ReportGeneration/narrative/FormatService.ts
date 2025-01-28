import { OutputFormat, sectionConfigs } from './OutputFormat';

interface TableColumn {
    key: string;
    header: string;
    width?: number;
}

interface TableOptions {
    columns: TableColumn[];
    includeHeader?: boolean;
}

export class FormatService {
    formatOutput(section: string, data: any, format?: OutputFormat): string {
        const sectionConfig = sectionConfigs[section] || {
            format: 'structured',
            includeHeading: true,
            defaultDetailLevel: 'standard'
        };

        const outputFormat = format || sectionConfig.format;

        switch (outputFormat) {
            case 'table':
                return this.formatAsTable(data, this.getTableOptions(section));
            case 'list':
                return this.formatAsList(data);
            case 'structured':
                return this.formatAsStructured(data);
            case 'narrative':
            default:
                return this.formatAsNarrative(data);
        }
    }

    private getTableOptions(section: string): TableOptions {
        switch (section) {
            case 'medications':
                return {
                    columns: [
                        { key: 'name', header: 'Medication', width: 20 },
                        { key: 'dosage', header: 'Dosage', width: 15 },
                        { key: 'frequency', header: 'Frequency', width: 20 },
                        { key: 'purpose', header: 'Purpose', width: 25 }
                    ],
                    includeHeader: true
                };
            case 'adl':
                return {
                    columns: [
                        { key: 'activity', header: 'Activity', width: 25 },
                        { key: 'independence', header: 'Level', width: 20 },
                        { key: 'notes', header: 'Notes', width: 35 }
                    ],
                    includeHeader: true
                };
            case 'rangeOfMotion':
                return {
                    columns: [
                        { key: 'joint', header: 'Joint', width: 15 },
                        { key: 'movement', header: 'Movement', width: 20 },
                        { key: 'leftActive', header: 'Left Active', width: 12 },
                        { key: 'rightActive', header: 'Right Active', width: 12 },
                        { key: 'notes', header: 'Notes', width: 21 }
                    ],
                    includeHeader: true
                };
            default:
                return {
                    columns: [
                        { key: 'item', header: 'Item', width: 30 },
                        { key: 'value', header: 'Value', width: 50 }
                    ],
                    includeHeader: false
                };
        }
    }

    private formatAsTable(data: any[], options: TableOptions): string {
        if (!Array.isArray(data) || data.length === 0) {
            return 'No data available';
        }

        const lines: string[] = [];
        const { columns, includeHeader } = options;

        // Add header if needed
        if (includeHeader) {
            lines.push(this.formatTableRow(
                columns.map(col => col.header),
                columns.map(col => col.width || 20)
            ));
            lines.push(this.formatTableDivider(columns));
        }

        // Add data rows
        data.forEach(item => {
            const rowData = columns.map(col => String(item[col.key] || ''));
            lines.push(this.formatTableRow(rowData, columns.map(col => col.width || 20)));
        });

        return lines.join('\n');
    }

    private formatTableRow(cells: string[], widths: number[]): string {
        return cells.map((cell, i) => 
            cell.padEnd(widths[i], ' ')
        ).join(' | ');
    }

    private formatTableDivider(columns: TableColumn[]): string {
        return columns.map(col => 
            '-'.repeat(col.width || 20)
        ).join('-+-');
    }

    private formatAsList(data: any[]): string {
        if (!Array.isArray(data) || data.length === 0) {
            return 'No items to display';
        }

        return data
            .map((item, index) => `${index + 1}. ${this.formatListItem(item)}`)
            .join('\n');
    }

    private formatListItem(item: any): string {
        if (typeof item === 'string') {
            return item;
        }
        if (typeof item === 'object') {
            const parts = [];
            if (item.name) parts.push(item.name);
            if (item.description) parts.push(item.description);
            if (item.value) parts.push(item.value);
            return parts.join(' - ') || JSON.stringify(item);
        }
        return String(item);
    }

    private formatAsStructured(data: any): string {
        if (!data || typeof data !== 'object') {
            return 'No data available';
        }

        const lines: string[] = [];
        for (const [key, value] of Object.entries(data)) {
            if (value === undefined || value === null) continue;

            const formattedKey = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase());

            if (typeof value === 'object' && !Array.isArray(value)) {
                lines.push(formattedKey + ':');
                lines.push(this.indent(this.formatAsStructured(value)));
            } else {
                lines.push(`${formattedKey}: ${this.formatValue(value)}`);
            }
        }

        return lines.join('\n');
    }

    private formatValue(value: any): string {
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        return String(value);
    }

    private indent(text: string): string {
        return text
            .split('\n')
            .map(line => '    ' + line)
            .join('\n');
    }

    private formatAsNarrative(data: any): string {
        // This is just a placeholder - actual narrative formatting
        // should be handled by the specific analyzers
        return String(data);
    }
}