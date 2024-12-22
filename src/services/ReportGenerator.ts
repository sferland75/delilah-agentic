import { BaseService } from '../core/BaseService';
import { AgentCoordinator } from '../core/coordinator/AgentCoordinator';
import { Report, ReportTemplate, ReportSection, AnalysisResult, AssessmentResult } from '../types';

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
        this.defaultTemplate = config.defaultTemplate ?? this.createDefaultTemplate();
        this.enableAutoSummary = config.enableAutoSummary ?? true;
        this.confidenceThreshold = config.confidenceThreshold ?? 0.75;

        this.initializeService();
    }

    private initializeService(): void {
        this.coordinator.register(this, [
            'generate-report',
            'update-template',
            'report-request'
        ]);
    }

    public async generateReport(data: any, template?: ReportTemplate): Promise<Report> {
        const reportTemplate = template ?? this.defaultTemplate;
        
        // Gather results from different agents
        const [analysisResult, assessmentResult] = await Promise.all([
            this.coordinator.request('analysis-complete', { dataId: data.id }),
            this.coordinator.request('assessment-result', { dataId: data.id })
        ]);

        const report = await this.buildReport(
            data,
            analysisResult,
            assessmentResult,
            reportTemplate
        );

        if (this.enableAutoSummary) {
            report.summary = await this.generateSummary(report);
        }

        return report;
    }

    private async buildReport(
        data: any,
        analysisResult: AnalysisResult,
        assessmentResult: AssessmentResult,
        template: ReportTemplate
    ): Promise<Report> {
        const sections: ReportSection[] = [];

        // Build each section based on template
        for (const sectionTemplate of template.sections) {
            const section = await this.buildSection(
                sectionTemplate,
                data,
                analysisResult,
                assessmentResult
            );
            if (section) {
                sections.push(section);
            }
        }

        return {
            id: data.id,
            timestamp: Date.now(),
            title: this.generateTitle(template, data),
            sections,
            metadata: {
                template: template.id,
                source: data.source,
                confidence: this.calculateOverallConfidence(analysisResult, assessmentResult)
            }
        };
    }

    private async buildSection(
        template: any,
        data: any,
        analysisResult: AnalysisResult,
        assessmentResult: AssessmentResult
    ): Promise<ReportSection | null> {
        switch (template.type) {
            case 'summary':
                return this.buildSummarySection(template, analysisResult, assessmentResult);
            case 'analysis':
                return this.buildAnalysisSection(template, analysisResult);
            case 'assessment':
                return this.buildAssessmentSection(template, assessmentResult);
            case 'data':
                return this.buildDataSection(template, data);
            case 'recommendations':
                return this.buildRecommendationsSection(template, analysisResult, assessmentResult);
            default:
                console.warn(`Unknown section type: ${template.type}`);
                return null;
        }
    }

    private buildSummarySection(
        template: any,
        analysisResult: AnalysisResult,
        assessmentResult: AssessmentResult
    ): ReportSection {
        return {
            title: template.title ?? 'Executive Summary',
            type: 'summary',
            content: [
                {
                    type: 'text',
                    value: this.generateSummaryText(analysisResult, assessmentResult)
                },
                {
                    type: 'metrics',
                    value: this.extractKeyMetrics(analysisResult, assessmentResult)
                }
            ]
        };
    }

    private buildAnalysisSection(
        template: any,
        analysisResult: AnalysisResult
    ): ReportSection {
        const patterns = analysisResult.patterns
            .filter(p => p.confidence > this.confidenceThreshold)
            .map(p => ({
                type: 'pattern',
                value: {
                    name: p.name,
                    confidence: p.confidence,
                    insights: analysisResult.insights
                        .filter(i => i.patternId === p.id)
                }
            }));

        return {
            title: template.title ?? 'Analysis Results',
            type: 'analysis',
            content: [
                {
                    type: 'text',
                    value: this.generateAnalysisOverview(analysisResult)
                },
                ...patterns
            ]
        };
    }

    private buildAssessmentSection(
        template: any,
        assessmentResult: AssessmentResult
    ): ReportSection {
        return {
            title: template.title ?? 'Assessment Details',
            type: 'assessment',
            content: [
                {
                    type: 'findings',
                    value: assessmentResult.findings
                },
                {
                    type: 'metrics',
                    value: this.extractAssessmentMetrics(assessmentResult)
                }
            ]
        };
    }

    private buildDataSection(template: any, data: any): ReportSection {
        return {
            title: template.title ?? 'Data Overview',
            type: 'data',
            content: [
                {
                    type: 'metadata',
                    value: this.extractRelevantMetadata(data)
                },
                {
                    type: 'summary',
                    value: this.summarizeData(data)
                }
            ]
        };
    }

    private buildRecommendationsSection(
        template: any,
        analysisResult: AnalysisResult,
        assessmentResult: AssessmentResult
    ): ReportSection {
        return {
            title: template.title ?? 'Recommendations',
            type: 'recommendations',
            content: [
                {
                    type: 'actionItems',
                    value: this.generateActionItems(analysisResult, assessmentResult)
                },
                {
                    type: 'nextSteps',
                    value: this.suggestNextSteps(analysisResult, assessmentResult)
                }
            ]
        };
    }

    private async generateSummary(report: Report): Promise<string> {
        const summaryInput = {
            title: report.title,
            sections: report.sections,
            confidence: report.metadata.confidence
        };

        const summary = await this.coordinator.request('generate-summary', summaryInput);
        return summary.content;
    }

    private calculateOverallConfidence(
        analysisResult: AnalysisResult,
        assessmentResult: AssessmentResult
    ): number {
        const weights = {
            analysis: 0.6,
            assessment: 0.4
        };

        return (
            analysisResult.confidence.score * weights.analysis +
            assessmentResult.confidence.score * weights.assessment
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

    private generateTitle(template: ReportTemplate, data: any): string {
        return `${template.name}: ${data.source ?? 'Analysis'} Report - ${new Date().toLocaleDateString()}`;
    }

    private generateSummaryText(analysisResult: AnalysisResult, assessmentResult: AssessmentResult): string {
        const confidence = this.calculateOverallConfidence(analysisResult, assessmentResult);
        const patterns = analysisResult.patterns.filter(p => p.confidence > this.confidenceThreshold);
        
        return `Analysis identified ${patterns.length} significant patterns with ${(confidence * 100).toFixed(1)}% overall confidence. `;
    }

    private extractKeyMetrics(analysisResult: AnalysisResult, assessmentResult: AssessmentResult): any {
        return {
            patternCount: analysisResult.patterns.length,
            significantPatterns: analysisResult.patterns.filter(p => p.confidence > this.confidenceThreshold).length,
            findings: assessmentResult.findings.length,
            confidence: this.calculateOverallConfidence(analysisResult, assessmentResult)
        };
    }

    private generateAnalysisOverview(analysisResult: AnalysisResult): string {
        const patterns = analysisResult.patterns.filter(p => p.confidence > this.confidenceThreshold);
        return `Analysis revealed ${patterns.length} significant patterns with insights derived from pattern matching and behavioral analysis.`;
    }

    private extractAssessmentMetrics(assessmentResult: AssessmentResult): any {
        return {
            findingCount: assessmentResult.findings.length,
            confidence: assessmentResult.confidence.score,
            factors: assessmentResult.confidence.factors
        };
    }

    private extractRelevantMetadata(data: any): any {
        const { id, source, timestamp, metadata = {} } = data;
        return { id, source, timestamp, ...metadata };
    }

    private summarizeData(data: any): string {
        return `Data from ${data.source ?? 'unknown source'} processed at ${new Date(data.timestamp).toLocaleString()}`;
    }

    private generateActionItems(analysisResult: AnalysisResult, assessmentResult: AssessmentResult): string[] {
        const items: string[] = [];
        
        // Add items based on pattern insights
        analysisResult.patterns
            .filter(p => p.confidence > this.confidenceThreshold)
            .forEach(pattern => {
                const insights = analysisResult.insights
                    .filter(i => i.patternId === pattern.id)
                    .map(i => i.content);
                items.push(...insights);
            });

        // Add items based on assessment findings
        assessmentResult.findings
            .filter(finding => finding.includes('action:'))
            .forEach(finding => items.push(finding.replace('action:', '').trim()));

        return items;
    }

    private suggestNextSteps(analysisResult: AnalysisResult, assessmentResult: AssessmentResult): string[] {
        const steps: string[] = [];
        
        // Suggest steps based on confidence levels
        if (analysisResult.confidence.score < 0.8) {
            steps.push('Gather additional pattern data to improve confidence');
        }

        if (assessmentResult.confidence.score < 0.8) {
            steps.push('Conduct follow-up assessment to validate findings');
        }

        // Add pattern-specific recommendations
        analysisResult.patterns
            .filter(p => p.confidence > this.confidenceThreshold)
            .forEach(pattern => {
                steps.push(`Further analyze pattern: ${pattern.name}`);
            });

        return steps;
    }
}