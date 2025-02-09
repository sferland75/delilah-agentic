import 'dotenv/config';
import fetch from 'node-fetch';
import { generateReportSection, generateFullReport } from './reportGenerator.js';
import mockData from '../testData/mockAssessment.json' assert { type: 'json' };

// @ts-ignore
if (!globalThis.fetch) {
    // @ts-ignore
    globalThis.fetch = fetch;
}

async function runTest() {
    console.log('Starting report generation test...');
    
    try {
        // Test single section first
        console.log('\nGenerating demographics section...');
        const demoSection = await generateReportSection('demographics', mockData);
        console.log('\nDemographics section result:', demoSection);

        // If successful, try full report
        console.log('\nGenerating full report...');
        const fullReport = await generateFullReport(mockData);
        console.log('\nFull report:', fullReport);
    } catch (error) {
        console.error('Error during test:', error);
    }
}

runTest();