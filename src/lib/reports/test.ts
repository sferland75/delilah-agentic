import { DelilahReportGenerator } from './index';
import path from 'path';
import fs from 'fs/promises';

describe('Delilah Report Generator', () => {
  const outputDir = path.join(__dirname, 'output');
  
  beforeAll(async () => {
    // Create output directory if it doesn't exist
    try {
      await fs.access(outputDir);
    } catch {
      await fs.mkdir(outputDir, { recursive: true });
    }
  });

  test('generates reports correctly', async () => {
    // Add your test implementation here
    expect(DelilahReportGenerator).toBeDefined();
  });

  afterAll(async () => {
    try {
      // Clean up test files
      const files = await fs.readdir(outputDir);
      for (const file of files) {
        await fs.unlink(path.join(outputDir, file)).catch(() => {
          // Ignore errors from files that can't be deleted
        });
      }
    } catch (error) {
      console.warn('Warning: Could not clean up test files:', error);
    }
  });
});
