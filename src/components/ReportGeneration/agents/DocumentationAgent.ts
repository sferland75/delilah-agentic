import { BaseAgent } from './core/BaseAgent';
import { Assessment, ProcessedData } from '../../../types/report';

interface DocumentationData {
    sources: string[];
    gaps: string[];
    reliability: string;
    notes?: string;
    medicalDocumentation?: Array<{
        type: string;
        date: string;
        provider: string;
        findings: string[];
    }>;
    imagingReports?: Array<{
        type: string;
        date: string;
        facility: string;
        findings: string[];
    }>;
    assessmentTools?: Array<{
        name: string;
        date: string;
        score: number | string;
        interpretation: string;
    }>;
}

export class DocumentationAgent extends BaseAgent {
    constructor(context: any) {
        super(context);
        this.name = 'Documentation Review';
        this.description = 'Analysis of documentation sources and completeness';
        this.orderNumber = 1.5;
        this.dataPath = ['documentation'];
    }

    async processData(data: Assessment): Promise<ProcessedData> {
        try {
            const documentation = data.documentation;
            if (!documentation) {
                return this.formatError('No documentation data available');
            }

            // Process and validate documentation data
            const processed = {
                sources: this.validateArray(documentation.sources),
                gaps: this.validateArray(documentation.gaps),
                reliability: documentation.reliability || 'Unknown',
                notes: documentation.notes,
                medicalDocumentation: this.processMedicalDocs(documentation.medicalDocumentation),
                imagingReports: this.processImagingReports(documentation.imagingReports),
                assessmentTools: this.processAssessmentTools(documentation.assessmentTools),
                summary: this.generateSummary(documentation)
            };

            return this.formatSuccess(processed);
        } catch (error) {
            return this.formatError('Error processing documentation data');
        }
    }

    private validateArray(arr: any): string[] {
        return Array.isArray(arr) ? arr : [];
    }

    private processMedicalDocs(docs: any[]): any[] {
        if (!Array.isArray(docs)) return [];
        
        return docs
            .filter(doc => doc?.type && doc?.date)
            .map(doc => ({
                type: doc.type,
                date: doc.date,
                provider: doc.provider || 'Unknown',
                findings: Array.isArray(doc.findings) ? doc.findings : []
            }));
    }

    private processImagingReports(reports: any[]): any[] {
        if (!Array.isArray(reports)) return [];
        
        return reports
            .filter(report => report?.type && report?.date)
            .map(report => ({
                type: report.type,
                date: report.date,
                facility: report.facility || 'Unknown',
                findings: Array.isArray(report.findings) ? report.findings : []
            }));
    }

    private processAssessmentTools(tools: any[]): any[] {
        if (!Array.isArray(tools)) return [];
        
        return tools
            .filter(tool => tool?.name && tool?.date)
            .map(tool => ({
                name: tool.name,
                date: tool.date,
                score: tool.score || 'Not scored',
                interpretation: tool.interpretation || 'No interpretation provided'
            }));
    }

    private generateSummary(documentation: DocumentationData): string {
        const summary: string[] = [];

        // Document completeness
        if (documentation.gaps?.length === 0) {
            summary.push('Documentation is complete with no identified gaps.');
        } else {
            summary.push('Documentation has some identified gaps that may require follow-up.');
        }

        // Reliability assessment
        if (documentation.reliability) {
            summary.push(`Overall reliability is considered ${documentation.reliability.toLowerCase()}.`);
        }

        // Source diversity
        if (documentation.sources?.length > 0) {
            summary.push(`Information gathered from ${documentation.sources.length} different sources.`);
        }

        return summary.join(' ');
    }

    protected formatBrief(data: ProcessedData): string {
        if (!data.valid) {
            return 'Documentation review not available';
        }

        const sections: string[] = [];

        // Basic source count
        if (data.data.sources.length) {
            sections.push(`Medical Documentation: ${data.data.sources.length}`);
        }

        // Reliability
        if (data.data.reliability) {
            sections.push(`Reliability: ${data.data.reliability}`);
        }

        // Gaps summary
        if (data.data.gaps.length) {
            sections.push(`Documentation gaps identified: ${data.data.gaps.length}`);
        }

        return sections.join('\n');
    }

    protected formatStandard(data: ProcessedData): string {
        if (!data.valid) {
            return 'Documentation review not available';
        }

        const sections: string[] = [];
        sections.push('Documentation Review:');

        // Sources
        if (data.data.sources.length) {
            sections.push('\nSources:');
            data.data.sources.forEach(source => {
                sections.push(`- ${source}`);
            });
        }

        // Medical Documentation
        if (data.data.medicalDocumentation?.length) {
            sections.push('\nMedical Reports:');
            data.data.medicalDocumentation.forEach(doc => {
                sections.push(`- ${doc.type} (${doc.date}) from ${doc.provider}`);
            });
        }

        // Documentation Gaps
        if (data.data.gaps.length) {
            sections.push('\nIdentified Gaps:');
            data.data.gaps.forEach(gap => {
                sections.push(`- ${gap}`);
            });
        }

        // Summary
        if (data.data.summary) {
            sections.push(`\nSummary: ${data.data.summary}`);
        }

        return sections.join('\n');
    }

    protected formatDetailed(data: ProcessedData): string {
        if (!data.valid) {
            return 'Documentation review not available';
        }

        const sections: string[] = [];
        sections.push('DOCUMENTATION REVIEW AND ANALYSIS');
        sections.push('================================\n');

        // Information Sources
        sections.push('INFORMATION SOURCES');
        sections.push('------------------');
        if (data.data.sources.length) {
            data.data.sources.forEach(source => {
                sections.push(`• ${source}`);
            });
        } else {
            sections.push('No sources documented');
        }
        sections.push('');

        // Medical Documentation
        if (data.data.medicalDocumentation?.length) {
            sections.push('MEDICAL DOCUMENTATION');
            sections.push('--------------------');
            data.data.medicalDocumentation.forEach(doc => {
                sections.push(`Type: ${doc.type}`);
                sections.push(`Date: ${doc.date}`);
                sections.push(`Provider: ${doc.provider}`);
                if (doc.findings.length) {
                    sections.push('Findings:');
                    doc.findings.forEach(finding => {
                        sections.push(`- ${finding}`);
                    });
                }
                sections.push('');
            });
        }

        // Imaging Reports
        if (data.data.imagingReports?.length) {
            sections.push('IMAGING REPORTS');
            sections.push('---------------');
            data.data.imagingReports.forEach(report => {
                sections.push(`Type: ${report.type}`);
                sections.push(`Date: ${report.date}`);
                sections.push(`Facility: ${report.facility}`);
                if (report.findings.length) {
                    sections.push('Findings:');
                    report.findings.forEach(finding => {
                        sections.push(`- ${finding}`);
                    });
                }
                sections.push('');
            });
        }

        // Assessment Tools
        if (data.data.assessmentTools?.length) {
            sections.push('ASSESSMENT TOOLS');
            sections.push('----------------');
            data.data.assessmentTools.forEach(tool => {
                sections.push(`Tool: ${tool.name}`);
                sections.push(`Date: ${tool.date}`);
                sections.push(`Score: ${tool.score}`);
                sections.push(`Interpretation: ${tool.interpretation}`);
                sections.push('');
            });
        }

        // Documentation Gaps
        sections.push('DOCUMENTATION GAPS');
        sections.push('------------------');
        if (data.data.gaps.length) {
            data.data.gaps.forEach(gap => {
                sections.push(`• ${gap}`);
            });
        } else {
            sections.push('No documentation gaps identified');
        }
        sections.push('');

        // Reliability Assessment
        sections.push('RELIABILITY ASSESSMENT');
        sections.push('---------------------');
        sections.push(`Overall Reliability: ${data.data.reliability}`);
        if (data.data.notes) {
            sections.push(`Notes: ${data.data.notes}`);
        }
        sections.push('');

        // Summary
        sections.push('SUMMARY');
        sections.push('-------');
        sections.push(data.data.summary);

        return sections.join('\n');
    }
}