import { DelilahReportGenerator } from './reportGenerator';
import fs from 'fs';
import path from 'path';

async function main() {
  try {
    // Read JSON file
    const assessmentData = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, '../../../delilah_assessment_2025-01-14 (16).json'), 
        'utf8'
      )
    );

    // Initialize generator with environment API key
    const generator = new DelilahReportGenerator({
      apiKey: process.env.ANTHROPIC_API_KEY || ''
    });

    // Generate report
    console.log('Generating report...');
    const report = await generator.generateReport(assessmentData);

    // Save output
    const outputPath = path.join(__dirname, 'output', 'generated-report.json');
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`Report saved to ${outputPath}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

main();