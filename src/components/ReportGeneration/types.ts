import { Assessment } from '../../types/report';

export interface ProcessedData {
    valid: boolean;
    data?: any;
    error?: string;
}

export interface ReportSection {
    name: string;
    type: string;
    orderNumber: number;
    content: string;
    valid: boolean;
    error?: string;
}

export interface AgentConfig {
    detailLevel: 'brief' | 'standard' | 'detailed';
    validateData: boolean;
    formatPreference: 'clinical' | 'plain';
    includeMetrics: boolean;
}

export interface AgentContext {
    config: AgentConfig;
    features: {
        enableNarrative: boolean;
        enableContextualAnalysis: boolean;
        enableDetailedFormatting: boolean;
    };
}

export interface AgentMetadata {
    name: string;
    description: string;
    orderNumber: number;
    dataPath: string[];
}

export interface AssessmentData {
    assessment: Assessment;
    metadata?: {
        version: string;
        processedAt: string;
    };
}

export interface NarrativeOptions {
    includeContext?: boolean;
    includeRecommendations?: boolean;
    style?: 'clinical' | 'plain';
}

export interface FormattingOptions {
    indentation?: number;
    bulletPoints?: boolean;
    headers?: boolean;
}