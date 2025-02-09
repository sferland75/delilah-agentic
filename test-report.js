import 'dotenv/config';
import fetch from 'node-fetch';
global.fetch = fetch;

import('./src/services/claudeReportGenerator.js').then(async (generator) => {
    const mockData = await import('./testData/mockAssessment.json', {
        assert: { type: 'json' }
    });

    console.log('Starting report generation test...');
    
    try {
        // Test single section first
        console.log('\nGenerating demographics section...');
        const demoSection = await generator.generateReportSection('demographics', mockData.default);
        console.log('\nDemographics section result:', demoSection);

        // If successful, try full report
        console.log('\nGenerating full report...');
        const fullReport = await generator.generateFullReport(mockData.default);
        console.log('\nFull report:', fullReport);
    } catch (error) {
        console.error('Error during test:', error);
    }
});