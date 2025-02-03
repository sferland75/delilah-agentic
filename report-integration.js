const NarrativeGenerator = require('./anthropic-narrative-generator');
const ReportTemplateSystem = require('./report-template-system');
const fs = require('fs').promises;

class ReportGenerator {
    constructor() {
        this.narrator = new NarrativeGenerator();
        this.templateSystem = new ReportTemplateSystem();
    }

    async generateFullReport(assessmentData, outputPath) {
        console.log("Starting report generation...");
        
        try {
            // Generate all narratives concurrently for efficiency
            console.log("Generating narratives using Claude API...");
            
            console.log("1. Generating background narrative...");
            const backgroundNarrative = await this.narrator.generateBackgroundNarrative(assessmentData.assessment);
            console.log("✓ Background narrative complete");
            
            console.log("2. Generating symptom narrative...");
            const symptomNarrative = await this.narrator.generateSymptomNarrative(assessmentData.assessment);
            console.log("✓ Symptom narrative complete");
            
            console.log("3. Generating functional narrative...");
            const functionalNarrative = await this.narrator.generateFunctionalNarrative(assessmentData.assessment);
            console.log("✓ Functional narrative complete");
            
            console.log("4. Generating ADL narrative...");
            const adlNarrative = await this.narrator.generateADLNarrative(assessmentData.assessment);
            console.log("✓ ADL narrative complete");
            
            console.log("5. Generating conclusion narrative...");
            const conclusionNarrative = await this.narrator.generateConclusionNarrative(assessmentData.assessment);
            console.log("✓ Conclusion narrative complete");

            // Prepare static data for the template
            const staticData = {
                reportDate: new Date().toISOString().split('T')[0],
                assessmentDate: assessmentData.metadata.lastModified.split('T')[0],
                firstName: assessmentData.assessment.demographics.firstName,
                lastName: assessmentData.assessment.demographics.lastName,
                dateOfBirth: assessmentData.assessment.demographics.dateOfBirth,
                incidentDate: "TBD", // Add to your assessment data
                claimNumber: "TBD", // Add to your assessment data
                accidentType: assessmentData.assessment.medicalHistory.injury.circumstance,
                assessorName: "TBD", // Add to your assessment data
                assessorCredentials: "TBD", // Add to your assessment data
                assessorLicense: "TBD" // Add to your assessment data
            };

            console.log("Preparing dynamic content...");
            const dynamicContent = {
                background: {
                    backgroundNarrative
                },
                currentStatus: {
                    physicalStatus: symptomNarrative,
                    functionalStatus: functionalNarrative
                },
                functioning: {
                    adlNarrative
                },
                conclusion: {
                    conclusionNarrative,
                    recommendations: this.generateRecommendations(assessmentData)
                }
            };

            // Generate the final report
            console.log("Generating final report...");
            const report = this.templateSystem.generateReport('default', staticData, dynamicContent);

            // Save to file
            console.log(`Saving report to ${outputPath}...`);
            await fs.writeFile(outputPath, report, 'utf8');

            console.log("Report generation complete!");
            return report;

        } catch (error) {
            console.error("Error generating report:", error.message);
            console.error("Stack trace:", error.stack);
            throw error;
        }
    }

    generateRecommendations(assessmentData) {
        // Add logic to generate specific recommendations based on assessment data
        const recommendations = [];

        // Analyze functional limitations
        if (assessmentData.assessment.functionalAssessment) {
            const rom = assessmentData.assessment.functionalAssessment.rangeOfMotion;
            if (rom && rom.measurements) {
                const limitedMovements = rom.measurements.filter(m => 
                    m.notes && !m.notes.includes('No identified limitations')
                );
                if (limitedMovements.length > 0) {
                    recommendations.push("Physical Therapy focusing on improving range of motion");
                }
            }
        }

        // Analyze cognitive symptoms
        if (assessmentData.assessment.symptoms.cognitive) {
            const cognitiveIssues = assessmentData.assessment.symptoms.cognitive
                .filter(s => s.severity === 'Moderate' || s.severity === 'Severe');
            if (cognitiveIssues.length > 0) {
                recommendations.push("Cognitive rehabilitation therapy");
            }
        }

        // Analyze environmental needs
        if (assessmentData.assessment.environmental.propertyOverview.recommendedModifications) {
            const modifications = assessmentData.assessment.environmental.propertyOverview.recommendedModifications;
            if (modifications.length > 0) {
                recommendations.push("Home modifications as detailed in environmental assessment");
            }
        }

        return recommendations.join("\n\n");
    }
}

// Test the integration
async function testIntegration() {
    try {
        // Read the sample assessment data
        console.log("Reading assessment data...");
        const assessmentData = JSON.parse(
            await fs.readFile('delilah_assessment_2025-01-14 (16).json', 'utf8')
        );

        const generator = new ReportGenerator();
        const outputPath = 'generated_report.txt';

        console.log("Starting integration test...");
        await generator.generateFullReport(assessmentData, outputPath);
        console.log(`Report successfully generated and saved to ${outputPath}`);

    } catch (error) {
        console.error("Integration test failed:", error.message);
        console.error("Stack trace:", error.stack);
        process.exit(1);  // Exit with error code
    }
}

// Run the integration test
testIntegration();