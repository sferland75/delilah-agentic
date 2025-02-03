import { ClaudeReportGenerator } from './claudeReportGenerator';
import fs from 'fs/promises';
import path from 'path';

interface ApiError extends Error {
    response?: Response;
}

async function testEnhancedReport() {
    try {
        console.log("\nStarting enhanced report generation test...");
        
        // Check for API key
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            throw new Error('No API key found. Please set ANTHROPIC_API_KEY environment variable.');
        }

        // Read the assessment data
        console.log("\nReading assessment data...");
        const assessmentData = JSON.parse(
            await fs.readFile(path.join(__dirname, '../../../delilah_assessment_2025-01-14 (16).json'), 'utf8')
        );

        // Initialize the report generator
        const generator = new ClaudeReportGenerator(apiKey, assessmentData);

        // Generate the report
        console.log("\nStarting report generation...");
        const report = await generator.generateFullReport();

        // Save the report
        const outputDir = path.join(__dirname, 'output');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const outputPath = path.join(outputDir, `enhanced-report-${timestamp}.txt`);

        console.log(`\nSaving report to ${outputPath}`);
        await fs.writeFile(outputPath, report, 'utf8');

        console.log("\nReport generation complete! ✓");
        console.log(`Report saved to: ${outputPath}`);

    } catch (error: unknown) {
        console.error("\nError in test:", error instanceof Error ? error.message : error);
        
        // Type guard for our custom error type
        if (error instanceof Error && 'response' in error) {
            const apiError = error as ApiError;
            if (apiError.response) {
                try {
                    const errorText = await apiError.response.text();
                    console.error("API Response:", errorText);
                } catch (textError) {
                    console.error("Could not read error response text");
                }
            }
        }
        
        process.exit(1);
    }
}

// Run the test
testEnhancedReport();