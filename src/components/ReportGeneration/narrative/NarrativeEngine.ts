import { Assessment } from '../../../types/report';
import { MedicationAnalyzer } from './MedicationAnalyzer';
import { SymptomAnalyzer } from './SymptomAnalyzer';
import { TemporalAnalyzer } from './TemporalAnalyzer';
import { ADLAnalyzer } from './ADLAnalyzer';

interface NarrativeConfig {
    enableContextualAnalysis: boolean;
}

interface NarrativeContext {
    clientName: string;
    timeline: any;
    symptoms: any[];
    medications: any[];
    adlPatterns: any[];
    functionalStatus: string;
}

export class NarrativeEngine {
    private config: NarrativeConfig;
    private narrativeContext: NarrativeContext | null = null;
    private medicationAnalyzer: MedicationAnalyzer;
    private symptomAnalyzer: SymptomAnalyzer;
    private temporalAnalyzer: TemporalAnalyzer;
    private adlAnalyzer: ADLAnalyzer;

    constructor(config: NarrativeConfig) {
        this.config = config;
        this.medicationAnalyzer = new MedicationAnalyzer();
        this.symptomAnalyzer = new SymptomAnalyzer();
        this.temporalAnalyzer = new TemporalAnalyzer();
        this.adlAnalyzer = new ADLAnalyzer();
    }

    async generateNarrative(data: any, section: string): Promise<string> {
        try {
            // Handle null/undefined data
            if (!data) {
                return 'No data available for narrative generation';
            }

            // Handle both Assessment and raw data
            const assessment = data.assessment || data;

            // Basic validation with safe access
            if (!assessment?.demographics) {
                return 'No data available for narrative generation';
            }

            // Initialize narrative context if not already done
            if (!this.narrativeContext) {
                try {
                    this.narrativeContext = await this.initializeContext(assessment);
                } catch (error) {
                    console.warn('Error initializing context:', error);
                    return 'Unable to process assessment data';
                }
            }

            // Generate appropriate narrative
            switch (section.toLowerCase()) {
                case 'overview':
                    return this.generateOverviewNarrative();
                case 'symptoms':
                    return this.generateSymptomNarrative(assessment);
                case 'functional':
                    return this.generateFunctionalNarrative(assessment);
                case 'invalid_section':
                    return 'Section not available';
                default:
                    return 'Section information available';
            }
        } catch (error) {
            console.warn('Error in narrative generation:', error);
            return `Unable to generate narrative for ${section}`;
        }
    }

    private async initializeContext(assessment: any): Promise<NarrativeContext> {
        const { demographics, medicalHistory, symptoms, adl } = assessment;

        // Process each component
        const analyzedSymptoms = await this.symptomAnalyzer.analyzeSymptoms(
            symptoms?.physical || [], 
            this.config.enableContextualAnalysis
        );

        const adlPatterns = await this.adlAnalyzer.analyzeADLPerformance(
            adl || {},
            symptoms?.physical || []
        );

        const timeline = await this.temporalAnalyzer.analyzeTimeline(assessment);

        return {
            clientName: `${demographics.firstName} ${demographics.lastName}`,
            timeline,
            symptoms: analyzedSymptoms,
            medications: medicalHistory?.medications || [],
            adlPatterns,
            functionalStatus: this.determineFunctionalStatus(adlPatterns)
        };
    }

    private generateOverviewNarrative(): string {
        if (!this.narrativeContext) {
            return 'Overview information not available';
        }

        const ctx = this.narrativeContext;
        const sections: string[] = [];

        // Client introduction with symptoms
        sections.push(`${ctx.clientName} presents with ${this.summarizeSymptoms(ctx.symptoms)}.`);

        // Current status and treatment
        sections.push(
            `Currently managed with ${this.generateMedicationSummary(ctx.medications)}, ` +
            `${ctx.functionalStatus}.`
        );

        // Impact and functional considerations
        if (ctx.symptoms.length > 0) {
            sections.push(
                `Symptoms impact function through ${this.summarizeImpacts(ctx.symptoms)}, ` +
                `requiring modified approaches to daily activities.`
            );
        }

        return sections.join(' ');
    }

    private generateSymptomNarrative(assessment: any): string {
        const { physical } = assessment.symptoms || {};
        const sections: string[] = [];

        // Physical symptoms
        if (Array.isArray(physical) && physical.length > 0) {
            sections.push('Physical symptoms include: ' + physical.map(s => 
                `${s.location} (${s.severity}, ${s.frequency})`
            ).join(', '));

            // Patterns
            const patterns = this.analyzeSymptomPatterns(physical);
            if (patterns.length > 0) {
                sections.push('Symptom patterns: ' + patterns.join('; '));
            }
        }

        return sections.join('\n\n') || 'No significant symptoms reported';
    }

    private generateFunctionalNarrative(assessment: any): string {
        if (!assessment.adl?.basic) {
            return 'No functional assessment data available';
        }

        const { transfers } = assessment.adl.basic;
        const sections: string[] = [];

        if (transfers) {
            const transferStatus = Object.entries(transfers)
                .map(([type, status]: [string, any]) => 
                    `${type.replace(/_/g, ' ')}: ${status.independence}`
                );
            
            if (transferStatus.length > 0) {
                sections.push('Transfer abilities:');
                sections.push(transferStatus.join('\n'));
            }
        }

        return sections.join('\n') || 'No ADL information documented';
    }

    private summarizeSymptoms(symptoms: any[]): string {
        if (!Array.isArray(symptoms) || symptoms.length === 0) {
            return 'no significant symptoms';
        }

        return symptoms
            .map(s => `${s.severity.toLowerCase()} ${s.location.toLowerCase()}`)
            .join(', ') || 'no significant symptoms';
    }

    private summarizeImpacts(symptoms: any[]): string {
        if (!Array.isArray(symptoms) || symptoms.length === 0) {
            return 'minimal functional limitations';
        }

        const impacts = symptoms
            .filter(s => s.impact)
            .map(s => s.impact)
            .flat();

        return impacts.length > 0 ? 
            impacts.join(', ') : 
            'minimal functional limitations';
    }

    private generateMedicationSummary(medications: any[]): string {
        if (!Array.isArray(medications) || medications.length === 0) {
            return 'current prescribed treatments';
        }

        const medNames = medications
            .filter(m => m.name)
            .map(m => m.name);

        return medNames.length > 0 ?
            medNames.join(', ') :
            'current prescribed treatments';
    }

    private determineFunctionalStatus(patterns: any[]): string {
        return patterns.length > 0 ?
            'maintaining modified independence with adaptations' :
            'baseline functional status';
    }

    private analyzeSymptomPatterns(symptoms: any[]): string[] {
        const patterns: string[] = [];

        // Check for common aggravating factors
        const aggravating = symptoms
            .filter(s => s.aggravating)
            .map(s => s.aggravating);

        if (aggravating.length > 0) {
            patterns.push(`Aggravated by ${aggravating.join(', ')}`);
        }

        // Check for common relieving factors
        const relieving = symptoms
            .filter(s => s.relieving)
            .map(s => s.relieving);

        if (relieving.length > 0) {
            patterns.push(`Relieved by ${relieving.join(', ')}`);
        }

        return patterns;
    }
}