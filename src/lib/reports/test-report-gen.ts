import { AssessmentMapper } from './assessmentMapper';
import { OTReportGenerator } from './reportGenerator';
import * as fs from 'fs';
import * as path from 'path';

async function generateReport() {
  try {
    // Read the assessment JSON
    const assessmentData = JSON.parse(
      await fs.promises.readFile(
        path.join(__dirname, '../../../delilah_assessment_2025-01-14 (16).json'),
        'utf8'
      )
    );

    // Map the data to our schema
    const reportData = AssessmentMapper.mapAssessmentToReport(assessmentData);

    // Generate the report
    const generator = new OTReportGenerator(reportData);
    const report = generator.generateReport();

    // Ensure output directory exists
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Save the output
    await fs.promises.writeFile(
      path.join(outputDir, 'generated-report.txt'),
      report,
      'utf8'
    );

    console.log('Report generated successfully!');
  } catch (error) {
    console.error('Error generating report:', error);
  }
}

// Run the generator
generateReport();