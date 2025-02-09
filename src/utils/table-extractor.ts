import { TableRow, TableData } from '../templates/data/table_types';

export class TableExtractor {
  private content: string;

  constructor(content: string) {
    this.content = content;
  }

  public static validateTable(table: TableData): boolean {
    if (!table || !Array.isArray(table.headers) || !Array.isArray(table.rows)) {
      return false;
    }

    return table.rows.every((row: TableRow) => 
      typeof row === 'object' && row !== null &&
      table.headers.every(header => header in row)
    );
  }

  public extract(tableName: string): TableData {
    // Find table section
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

    // Extract headers
    const headers = lines[0]
      .split('|')
      .map(header => header.trim())
      .filter(header => header.length > 0);

    // Extract rows
    const rows = lines.slice(1).map(line => {
      const values = line
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell.length > 0);

      const row: TableRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });

      return row;
    });

    return { headers, rows };
  }

  public extractColumns(tableName: string, columns: string[]): TableData {
    const fullTable = this.extract(tableName);
    const filteredHeaders = fullTable.headers.filter(header => columns.includes(header));
    
    const filteredRows = fullTable.rows.map(row => {
      const newRow: TableRow = {};
      filteredHeaders.forEach(header => {
        newRow[header] = row[header];
      });
      return newRow;
    });

    return {
      headers: filteredHeaders,
      rows: filteredRows
    };
  }
}