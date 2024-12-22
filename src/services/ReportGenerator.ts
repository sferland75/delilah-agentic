import { BaseService } from '../core/BaseService';
import { AgentCoordinator } from '../core/coordinator/AgentCoordinator';
import {
    Report,
    ReportTemplate,
    ReportSection,
    ReportContent,
    ReportGenerationError,
    ReportErrorCode,
    AnalysisResult,
    AssessmentResult
} from '../types';

export interface ReportGeneratorConfig {
    defaultTemplate?: ReportTemplate;
    enableAutoSummary?: boolean;
    confidenceThreshold?: number;
}

export class ReportGenerator extends BaseService {
    private coordinator: AgentCoordinator;
    private defaultTemplate: ReportTemplate;
    private enableAutoSummary: boolean;
    private confidenceThreshold: number;

    constructor(
        coordinator: AgentCoordinator,
        config: ReportGeneratorConfig = {}
    ) {
        super('report-generator');
        this.coordinator = coordinator;
        this.validateTemplate(config.defaultTemplate);
        this.defaultTemplate = config.defaultTemplate ?? this.createDefaultTemplate();
        this.enableAutoSummary = config.enableAutoSummary ?? true;
        this.confidenceThreshold = config.confidenceThreshold ?? 0.75;

        this.initializeService();
    }

    private validateTemplate(template?: ReportTemplate): void {
        if (!template) return;

        if (!template.id || !template.name || !Array.isArray(template.sections)) {
            throw new ReportGenerationError(
                'Invalid template structure',
                ReportErrorCode.INVALID_TEMPLATE
            );
        }

        // Validate each section
        template.sections.forEach(section => {
            if (!section.type || !section.title) {
                throw new ReportGenerationError(
                    `Invalid section in template ${template.id}`,
                    ReportErrorCode.INVALID_TEMPLATE
                );
            }
        });
    }

    private initializeService(): void {
        this.coordinator.register(this, [
            'generate-report',
            'update-template',
            'report-request'
        ]);
    }

    public async generateReport(data: Record<string, any>, template?: ReportTemplate): Promise<Report> {
        try {
            if (!data?.id) {
                throw new ReportGenerationError(
                    'Missing required data fields',
                    ReportErrorCode.MISSING_DATA
                );
            }

            const reportTemplate = template ?? this.defaultTemplate;
            this.validateTemplate(reportTemplate);

            // Gather results from different agents
            const [analysisResult, assessmentResult] = await Promise.all([
                this.coordinator.request('analysis-complete', { dataId: data.id })
                    .catch(error => {
                        console.error('Error fetching analysis result:', error);
                        return null;
                    }),
                this.coordinator.request('assessment-result', { dataId: data.id })
                    .catch(error => {
                        console.error('Error fetching assessment result:', error);
                        return null;
                    })
            ]);

            if (!analysisResult && !assessmentResult) {
                throw new ReportGenerationError(
                    'Failed to retrieve agent results',
                    ReportErrorCode.AGENT_COMMUNICATION
                );
            }

            const report = await this.buildReport(
                data,
                analysisResult,
                assessmentResult,
                reportTemplate
            );

            if (this.enableAutoSummary) {
                try {
                    report.summary = await this.generateSummary(report);
                } catch (error) {
                    console.warn('Failed to generate auto-summary:', error);
                }
            }

            return report;

        } catch (error) {
            if (error instanceof ReportGenerationError) {
                throw error;
            }
            throw new ReportGenerationError(
                `Failed to generate report: ${error.message}`,
                ReportErrorCode.VALIDATION_ERROR
            );
        }
    }

    private async buildReport(
        data: Record<string, any>,
        analysisResult: AnalysisResult | null,
        assessmentResult: AssessmentResult | null,
        template: ReportTemplate
    ): Promise<Report> {
        const sections: ReportSection[] = [];

        for (const sectionTemplate of template.sections) {
            try {
                const section = await this.buildSection(
                    sectionTemplate,
                    data,
                    analysisResult,
                    assessmentResult
                );
                if (section) {
                    sections.push(section);
                }
            } catch (error) {
                console.warn(`Failed to build section ${sectionTemplate.type}:`, error);
            }
        }

        const confidence = this.calculateOverallConfidence(analysisResult, assessmentResult);

        return {
            id: data.id,
            timestamp: Date.now(),
            title: this.generateTitle(template, data),
            sections,
            metadata: {
                template: template.id,
                source: data.source,
                confidence,
                generatedBy: this.id,
                version: '1.0'
            }
        };
    }

    private calculateOverallConfidence(
        analysisResult: AnalysisResult | null,
        assessmentResult: AssessmentResult | null
    ): number {
        const weights = {
            analysis: 0.6,
            assessment: 0.4
        };

        const analysisConfidence = analysisResult?.confidence?.score ?? 0;
        const assessmentConfidence = assessmentResult?.confidence?.score ?? 0;

        return (
            analysisConfidence * weights.analysis +
            assessmentConfidence * weights.assessment
        );
    }

    private createDefaultTemplate(): ReportTemplate {
        return {
            id: 'default',
            name: 'Standard Report Template',
            sections: [
                { type: 'summary', title: 'Executive Summary' },
                { type: 'analysis', title: 'Analysis Results' },
                { type: 'assessment', title: 'Assessment Details' },
                { type: 'data', title: 'Data Overview' },
                { type: 'recommendations', title: 'Recommendations' }
            ]
        };
    }

    private generateTitle(template: ReportTemplate, data: Record<string, any>): string {
        return `${template.name}: ${data.source ?? 'Analysis'} Report - ${new Date().toLocaleDateString()}`;
    }
}