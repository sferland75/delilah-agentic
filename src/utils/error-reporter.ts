export interface ValidationError {
    field: string;
    value: string;
    error: string;
    section: string;
}

export class ErrorReporter {
    private errors: ValidationError[] = [];

    /**
     * Add a validation error
     */
    addError(error: ValidationError): void {
        this.errors.push(error);
    }

    /**
     * Add multiple validation errors
     */
    addErrors(errors: ValidationError[]): void {
        this.errors.push(...errors);
    }

    /**
     * Get all errors
     */
    getErrors(): ValidationError[] {
        return this.errors;
    }

    /**
     * Get errors for a specific section
     */
    getErrorsBySection(section: string): ValidationError[] {
        return this.errors.filter(error => error.section === section);
    }

    /**
     * Check if there are any errors
     */
    hasErrors(): boolean {
        return this.errors.length > 0;
    }

    /**
     * Clear all errors
     */
    clearErrors(): void {
        this.errors = [];
    }

    /**
     * Get summary of errors
     */
    getSummary(): string {
        if (!this.hasErrors()) {
            return 'No validation errors found.';
        }

        const sections = [...new Set(this.errors.map(error => error.section))];
        let summary = 'Validation Errors:\n\n';

        for (const section of sections) {
            const sectionErrors = this.getErrorsBySection(section);
            summary += `${section}:\n`;
            sectionErrors.forEach(error => {
                summary += `- ${error.field}: ${error.error} (Value: "${error.value}")\n`;
            });
            summary += '\n';
        }

        return summary;
    }

    /**
     * Format error for specific field
     */
    static formatError(field: string, value: string, section: string, issue: string): ValidationError {
        return {
            field,
            value,
            error: issue,
            section
        };
    }
}
