import { DataSanitizer } from '../data-sanitizer';

describe('DataSanitizer', () => {
    describe('sanitizeText', () => {
        it('should convert smart quotes and dashes to standard ASCII', () => {
            const input = "It's a 'test' with an em-dash";
            const expected = "It's a 'test' with an em-dash";
            expect(DataSanitizer.sanitizeText(input)).toBe(expected);
        });

        it('should handle empty strings', () => {
            expect(DataSanitizer.sanitizeText('')).toBe('');
        });

        it('should handle strings without special characters', () => {
            const input = "Regular text 123";
            expect(DataSanitizer.sanitizeText(input)).toBe(input);
        });
    });

    describe('sanitizeHtml', () => {
        it('should remove HTML tags', () => {
            const input = "<p>Test</p><br/><div>Content</div>";
            expect(DataSanitizer.sanitizeHtml(input)).toBe("Test Content");
        });

        it('should handle empty strings', () => {
            expect(DataSanitizer.sanitizeHtml('')).toBe('');
        });

        it('should preserve whitespace between elements', () => {
            const input = "<p>First</p> <p>Second</p>";
            expect(DataSanitizer.sanitizeHtml(input)).toBe("First Second");
        });
    });
});