import { DataFormat, ValidationResult, ValidationError } from '../../types';

type ValidationRule = (data: any) => ValidationResult | Promise<ValidationResult>;

export class DataValidator {
    private rules: Map<DataFormat, ValidationRule[]>;

    constructor() {
        this.rules = new Map();
        this.initializeDefaultRules();
    }

    private initializeDefaultRules(): void {
        // Generic rules for all formats
        const genericRules: ValidationRule[] = [
            // Check for null or undefined
            (data: any) => ({
                valid: data != null,
                errors: data == null ? ['Data cannot be null or undefined'] : []
            }),

            // Check for empty objects
            (data: any) => {
                if (typeof data === 'object' && Object.keys(data).length === 0) {
                    return {
                        valid: false,
                        errors: ['Data object cannot be empty']
                    };
                }
                return { valid: true, errors: [] };
            }
        ];

        // JSON format rules
        this.rules.set('json', [
            ...genericRules,
            (data: any) => {
                try {
                    if (typeof data === 'string') {
                        JSON.parse(data);
                    }
                    return { valid: true, errors: [] };
                } catch (error) {
                    return {
                        valid: false,
                        errors: ['Invalid JSON format']
                    };
                }
            }
        ]);

        // CSV format rules
        this.rules.set('csv', [
            ...genericRules,
            (data: any) => {
                if (typeof data === 'string') {
                    const lines = data.split('\n');
                    if (lines.length < 2) {
                        return {
                            valid: false,
                            errors: ['CSV must contain header and data rows']
                        };
                    }
                    const headerCount = lines[0].split(',').length;
                    const validRows = lines.every(line => 
                        line.trim() === '' || line.split(',').length === headerCount
                    );
                    return {
                        valid: validRows,
                        errors: validRows ? [] : ['Inconsistent column count in CSV']
                    };
                }
                return { valid: true, errors: [] };
            }
        ]);

        // XML format rules
        this.rules.set('xml', [
            ...genericRules,
            (data: any) => {
                if (typeof data === 'string') {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(data, 'text/xml');
                        const parseError = doc.querySelector('parsererror');
                        return {
                            valid: !parseError,
                            errors: parseError ? ['Invalid XML format'] : []
                        };
                    } catch (error) {
                        return {
                            valid: false,
                            errors: ['XML parsing failed']
                        };
                    }
                }
                return { valid: true, errors: [] };
            }
        ]);

        // Raw text format rules
        this.rules.set('text', [
            ...genericRules,
            (data: any) => ({
                valid: typeof data === 'string' && data.trim().length > 0,
                errors: typeof data !== 'string' || data.trim().length === 0 ?
                    ['Text data cannot be empty'] : []
            })
        ]);
    }

    public async validate(data: any, format: DataFormat): Promise<ValidationResult> {
        const rules = this.rules.get(format) ?? [];
        const errors: string[] = [];

        for (const rule of rules) {
            try {
                const result = await rule(data);
                if (!result.valid) {
                    errors.push(...result.errors);
                }
            } catch (error) {
                errors.push(`Validation error: ${error.message}`);
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    public addRule(format: DataFormat, rule: ValidationRule): void {
        const formatRules = this.rules.get(format) ?? [];
        formatRules.push(rule);
        this.rules.set(format, formatRules);
    }

    public removeRule(format: DataFormat, rule: ValidationRule): void {
        const formatRules = this.rules.get(format) ?? [];
        const index = formatRules.indexOf(rule);
        if (index !== -1) {
            formatRules.splice(index, 1);
            this.rules.set(format, formatRules);
        }
    }

    public clearRules(format?: DataFormat): void {
        if (format) {
            this.rules.delete(format);
        } else {
            this.rules.clear();
        }
    }
}