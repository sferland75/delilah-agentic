import { createClaudeService } from './claude.service';
import { AssessmentData } from '../templates/data/assessment_data';

export async function generateReportSections(data: AssessmentData) {
    // Initialize Claude service with API key from environment
    const claudeService = createClaudeService(process.env.ANTHROPIC_API_KEY || '');

    try {
        // Generate Summary of Findings
        const summary = await claudeService.generateSummaryOfFindings(data);
        console.log('Summary generated successfully');

        // Generate AMA Analysis if needed
        if (data.demographics.insurance?.claimNumber?.includes('CAT')) {
            const amaAnalysis = await claudeService.generateAMAAnalysis(data);
            console.log('AMA analysis generated successfully');
        }

        // Generate Attendant Care rationales if needed
        if (data.demographics.insurance?.claimNumber?.includes('FORM1')) {
            // Example task
            const dressRationale = await claudeService.generateAttendantCareRationale(
                data,
                'Dressing',
                'Level1'
            );
            console.log('Attendant care rationale generated successfully');
        }

        // Generate Housekeeping rationales if needed
        if (data.demographics.insurance?.claimNumber?.includes('HK')) {
            // Example task
            const cleaningRationale = await claudeService.generateHousekeepingRationale(
                data,
                'Bathroom Cleaning'
            );
            console.log('Housekeeping rationale generated successfully');
        }

        return {
            summary,
            amaAnalysis,
            attendantCareRationales,
            housekeepingRationales
        };

    } catch (error) {
        console.error('Error generating report sections:', error);
        throw error;
    }
}

// Example usage
/*
const assessmentData: AssessmentData = {
    // ... populated with actual assessment data
};

generateReportSections(assessmentData)
    .then(sections => {
        // Use generated sections in report
        console.log('Report sections generated successfully');
    })
    .catch(error => {
        console.error('Error:', error);
    });
*/