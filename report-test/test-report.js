import { generateReportSection, generateFullReport } from './report-generator.js';
import { readFile, writeFile } from 'fs/promises';

async function runTest() {
    console.log('Starting report generation test...');
    
    try {
        // Load mock data
        const mockDataText = await readFile('./testData/mockAssessment.json', 'utf8');
        const mockData = JSON.parse(mockDataText);

        // Test single section first
        console.log('\nGenerating demographics section...');
        const demoSection = await generateReportSection('demographics', mockData);
        console.log('\nDemographics section result:\n', demoSection);

        // If successful, try full report
        console.log('\nGenerating full report...');
        const fullReport = await generateFullReport(mockData);
        console.log('\nFull report:\n', fullReport);

        // Save the report to a file
        await writeFile('generated-report.txt', fullReport);
        console.log('\nReport saved to generated-report.txt');
    } catch (error) {
        console.error('Error during test:', error);
    }
}

runTest();