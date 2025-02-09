import { TableExtractor } from '../table-extractor';
import { TableData, TableRow } from '../../templates/data/table_types';

describe('TableExtractor', () => {
  describe('validateTable', () => {
    it('validates a correct table structure', () => {
      const validTable: TableData = {
        headers: ['Col1', 'Col2'],
        rows: [
          { Col1: 'value1', Col2: 'value2' },
          { Col1: 'value3', Col2: 'value4' }
        ]
      };
      expect(TableExtractor.validateTable(validTable)).toBe(true);
    });

    it('rejects invalid table structure', () => {
      const invalidTable = {
        headers: ['Col1', 'Col2'],
        rows: [
          { Col1: 'value1' } as TableRow,  // Missing Col2
          { Col1: 'value2', Col2: 'value3' } as TableRow
        ],
        rowCount: 2
      };
      expect(TableExtractor.validateTable(invalidTable as TableData)).toBe(false);
    });
  });

  describe('extract', () => {
    const sampleText = `
      Test Table
      Header1 | Header2 | Header3
      Value1  | Value2  | Value3
      Value4  | Value5  | Value6
    `;

    it('extracts table data correctly', () => {
      const extractor = new TableExtractor(sampleText);
      const result = extractor.extract('Test Table');

      expect(result.headers).toEqual(['Header1', 'Header2', 'Header3']);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0]).toEqual({
        Header1: 'Value1',
        Header2: 'Value2',
        Header3: 'Value3'
      });
    });

    it('handles missing table gracefully', () => {
      const extractor = new TableExtractor(sampleText);
      const result = extractor.extract('Non-existent Table');

      expect(result.headers).toEqual([]);
      expect(result.rows).toEqual([]);
    });
  });

  describe('extractColumns', () => {
    const sampleText = `
      Test Table
      Header1 | Header2 | Header3
      Value1  | Value2  | Value3
      Value4  | Value5  | Value6
    `;

    it('extracts specified columns', () => {
      const extractor = new TableExtractor(sampleText);
      const result = extractor.extractColumns('Test Table', ['Header1', 'Header3']);

      expect(result.headers).toEqual(['Header1', 'Header3']);
      expect(result.rows[0]).toEqual({
        Header1: 'Value1',
        Header3: 'Value3'
      });
    });

    it('handles non-existent columns gracefully', () => {
      const extractor = new TableExtractor(sampleText);
      const result = extractor.extractColumns('Test Table', ['NonExistent']);

      expect(result.headers).toEqual([]);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0]).toEqual({});
    });
  });
});