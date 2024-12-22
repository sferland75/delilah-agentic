export interface ReportTemplate {
    id: string;
    name: string;
    sections: ReportSection[];
}

export interface Report {
    id: string;
    timestamp: number;
    title: string;
    sections: ReportSection[];
    summary?: string;
    metadata: ReportMetadata;
}

export interface ReportSection {
    title: string;
    type: ReportSectionType;
    content: ReportContent[];
}

export interface ReportMetadata {
    template: string;
    source?: string;
    confidence: number;
    generatedBy?: string;
    version?: string;
}

export type ReportSectionType = 'summary' | 'analysis' | 'assessment' | 'data' | 'recommendations';

export interface ReportContent {
    type: ReportContentType;
    value: any;
}

export type ReportContentType = 'text' | 'metrics' | 'findings' | 'pattern' | 'metadata' | 'summary' | 'actionItems' | 'nextSteps';

export class ReportGenerationError extends Error {
    constructor(message: string, public code: ReportErrorCode) {
        super(message);
        this.name = 'ReportGenerationError';
    }
}

export enum ReportErrorCode {
    INVALID_TEMPLATE = 'INVALID_TEMPLATE',
    MISSING_DATA = 'MISSING_DATA',
    AGENT_COMMUNICATION = 'AGENT_COMMUNICATION',
    VALIDATION_ERROR = 'VALIDATION_ERROR'
}