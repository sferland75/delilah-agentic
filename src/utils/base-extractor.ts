import { DataSanitizer } from './data-sanitizer';

export abstract class BaseExtractor {
  protected content: string;

  constructor(content: string) {
    this.content = content || '';
  }

  protected findSection(sectionName: string): string {
    const regex = new RegExp(`${sectionName}[\\s\\S]*?(?=\\n\\s*\\n|$)`, 'i');
    const match = this.content.match(regex);
    return match ? match[0] : '';
  }

  protected extractParagraph(section: string, marker: string): string {
    const regex = new RegExp(`${marker}\\s*([\\s\\S]*?)(?=\\n\\s*\\n|$)`, 'i');
    const match = section.match(regex);
    return DataSanitizer.cleanText(match ? match[1] : '');
  }

  protected extractList(section: string, marker: string): string[] {
    const text = this.extractParagraph(section, marker);
    return text
      .split(/[,;\n]/)
      .map(item => DataSanitizer.cleanText(item))
      .filter(item => item.length > 0);
  }

  protected extractDate(marker: string): string {
    const regex = new RegExp(`${marker}\\s*(\\d{4}-\\d{2}-\\d{2}|\\d{2}/\\d{2}/\\d{4}|[A-Za-z]+ \\d{1,2}, \\d{4})`, 'i');
    const match = this.content.match(regex);
    return match ? match[1] : '';
  }

  protected extractField(fieldName: string, section?: string): string {
    const searchText = section || this.content;
    const regex = new RegExp(`${fieldName}\\s*:?\\s*([^\\n]+)`, 'i');
    const match = searchText.match(regex);
    return DataSanitizer.cleanText(match ? match[1] : '');
  }

  protected extractTable<T = Record<string, string>>(section: string, tableName: string): { headers: string[]; rows: T[] } {
    try {
      const tableRegex = new RegExp(`${tableName}\\s*\\n([\\s\\S]*?)(?=\\n\\s*\\n|$)`);
      const tableMatch = this.content.match(tableRegex);
      
      if (!tableMatch) {
        return { headers: [], rows: [] };
      }

      const tableContent = tableMatch[1];
      const lines = tableContent.split('\n').filter(line => line.trim());

      if (lines.length < 2) {
        return { headers: [], rows: [] };
      }

      const headers = lines[0]
        .split('|')
        .map(header => DataSanitizer.cleanText(header))
        .filter(header => header.length > 0);

      const rows = lines.slice(1).map(line => {
        const values = line
          .split('|')
          .map(cell => DataSanitizer.cleanText(cell));

        const row = {} as T;
        headers.forEach((header, index) => {
          (row as any)[header] = values[index] || '';
        });

        return row;
      });

      return { headers, rows };
    } catch (error) {
      console.error('Error extracting table:', error);
      return { headers: [], rows: [] };
    }
  }
}