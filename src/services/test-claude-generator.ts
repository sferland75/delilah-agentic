import { generateReportSection, generateFullReport } from './claudeReportGenerator';
import mockData from '../../testData/mockAssessment.json';

// Test a single section
async function testSectionGeneration() {
  try {
    console.log('Testing demographics section generation...');
    const demographicsSection = await generateReportSection('demographics', mockData);
    console.log('Demographics section generated successfully:', demographicsSection);
  } catch (error) {
    console.error('Error in section generation test:', error);
  }
}

// Test full report generation
async function testFullReport() {
  try {
    console.log('Testing full report generation...');
    const fullReport = await generateFullReport(mockData);
    console.log('Full report generated successfully:', fullReport);
  } catch (error) {
    console.error('Error in full report test:', error);
  }
}

// Run tests
async function runTests() {
  await testSectionGeneration();
  await testFullReport();
}

runTests();