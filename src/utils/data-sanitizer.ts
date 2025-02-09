export class DataSanitizer {
    /**
     * Generic text cleaning function that handles most use cases
     */
    public static cleanText(value: string | undefined | null): string {
        return DataSanitizer.sanitizeText(value);
    }
    
    /**
     * Sanitizes text by removing markdown, normalizing quotes and spaces
     */
    public static sanitizeText(value: string | undefined | null): string {
        if (!value) return '';
        
        return value
            .replace(/\[|\]|{\.mark}|\*\*/g, '')  // Remove markdown
            .replace(/\\([()])/g, '$1')           // Handle escaped parentheses
            .replace(/[""]/g, '"')                // Normalize quotes
            .replace(/['']/g, "'")                // Normalize apostrophes
            .replace(/[—–]/g, '-')                // Normalize dashes
            .replace(/\s+/g, ' ')                 // Normalize spaces
            .trim();
    }

    /**
     * Removes HTML tags while preserving text content
     */
    public static sanitizeHtml(value: string | undefined | null): string {
        if (!value) return '';
        return value
            .replace(/<[^>]*>/g, ' ')    // Remove HTML tags
            .replace(/\s+/g, ' ')        // Normalize whitespace
            .trim();
    }

    /**
     * Converts string to number, handling various formats
     */
    public static sanitizeNumber(value: string | undefined | null): number {
        if (!value) return 0;
        const numeric = value.replace(/[^\d.-]/g, '');
        return parseFloat(numeric) || 0;
    }

    /**
     * Converts string to boolean based on common truthy values
     */
    public static sanitizeBoolean(value: string | undefined | null): boolean {
        if (!value) return false;
        const normalized = value.toLowerCase().trim();
        return ['yes', 'true', '1', 'y'].includes(normalized);
    }

    /**
     * Sanitizes and formats date strings
     */
    public static sanitizeDate(value: string | undefined | null): string {
        if (!value) return '';
        return DataSanitizer.cleanText(value);
    }

    /**
     * Converts delimited text into array of strings
     */
    public static sanitizeList(value: string | undefined | null): string[] {
        if (!value) return [];
        return value
            .split(/[,;\n]/)
            .map(item => DataSanitizer.cleanText(item))
            .filter(item => item.length > 0);
    }

    /**
     * Extracts plain text from markdown
     */
    public static sanitizeMarkdown(value: string | undefined | null): string {
        if (!value) return '';
        return value
            .replace(/[#*_~`]/g, '')     // Remove markdown syntax
            .replace(/\[(.*?)\]\(.*?\)/g, '$1')  // Convert links to text
            .replace(/\s+/g, ' ')
            .trim();
    }

    /**
     * Sanitizes text fields in an object recursively
     */
    public static sanitizeObject<T extends object>(obj: T): T {
        const result = {} as T;
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                (result as any)[key] = DataSanitizer.cleanText(value);
            } else if (Array.isArray(value)) {
                (result as any)[key] = value.map(item => 
                    typeof item === 'string' ? DataSanitizer.cleanText(item) : item
                );
            } else if (value && typeof value === 'object') {
                (result as any)[key] = DataSanitizer.sanitizeObject(value);
            } else {
                (result as any)[key] = value;
            }
        }
        return result;
    }
}