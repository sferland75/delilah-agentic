import { ClaudeReportGenerator } from './claudeReportGenerator';
import * as fs from 'fs';
import * as path from 'path';

async function generateReport() {
  try {
    // Read assessment JSON
    const assessmentData = JSON.parse(
      await fs.promises.readFile(
        path.join(__dirname, '../../../delilah_assessment_2025-01-14 (16).json'),
        'utf8'
      )
    );

    // Read additional context documents
    const contextDocs = [
      // Add paths to medical reports for context
      'D:/delilah/IHAs/medical_report_1.pdf',
      'D:/delilah/IHAs/medical_report_2.pdf'
    ];

    const contextContent = await Promise.all(
      contextDocs.map(async (docPath) => {
        try {
          return await fs.promises.readFile(docPath, 'utf8');
        } catch (e) {
          console.warn(`Could not read context document: ${docPath}`);
          return '';
        }
      })
    );

    // Generate report using Claude
    const generator = new ClaudeReportGenerator(
      process.env.ANTHROPIC_API_KEY || '',
      assessmentData,
      contextContent
    );

    console.log('Generating report with Claude...');
    const report = await generator.generateReport();

    // Save output
    const outputPath = path.join(__dirname, 'output', 'claude-generated-report.txt');
    await fs.promises.writeFile(outputPath, report, 'utf8');

    console.log('Report generated successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

generateReport();