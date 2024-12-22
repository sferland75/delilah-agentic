// Core Types

export interface SystemConfig {
    confidenceThreshold: number;
    enableLearning: boolean;
    metricsInterval: number;
    retentionPeriod: number;
}

export type SystemStatus = 'initializing' | 'ready' | 'processing' | 'error' | 'shutting_down' | 'shutdown';

// Agent Types

export interface BaseAgentConfig {
    id: string;
    type: string;
    confidence?: number;
    metadata?: Record<string, any>;
}

export interface Pattern {
    id: string;
    type: string;
    confidence: number;
    features?: PatternFeature[];
    correlations?: string[];
    content?: string;
    lastUpdated: number;
    source?: string;
}

export interface PatternFeature {
    name: string;
    type: 'exact' | 'range' | 'threshold';
    value?: any;
    min?: number;
    max?: number;
    threshold?: number;
    operator?: 'above' | 'below' | 'equals' | 'not';
    confidence?: number;
    metadata?: Record<string, any>;
}

export interface AnalysisResult {
    id: string;
    timestamp: number;
    patterns: Pattern[];
    confidence: Confidence;
    insights: string[];
}

export interface AssessmentResult {
    id: string;
    timestamp: number;
    confidence: Confidence;
    findings: string[];
    metadata?: Record<string, any>;
}

// Monitoring Types

export interface MetricData {
    name: string;
    value: number;
    unit?: string;
    timestamp: number;
    componentId: string;
    tags?: Record<string, string>;
}

export interface HealthStatus {
    componentId: string;
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: number;
    message?: string;
    details?: Record<string, any>;
}

export interface AlertConfig {
    id: string;
    name: string;
    componentId: string;
    description?: string;
    rule: AlertRule;
    priority: 'low' | 'medium' | 'high' | 'critical';
    active?: boolean;
    actions?: AlertAction[];
}

export interface AlertRule {
    type: 'threshold' | 'health' | 'pattern';
    condition: 'above' | 'below' | 'equals' | 'not';
    threshold?: number;
    status?: string;
    pattern?: RegExp;
    duration?: number;
}

export interface AlertAction {
    type: 'notification' | 'webhook' | 'email';
    target: string;
    template?: string;
    retries?: number;
}

// Report Types

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

// Processing Types

export interface ProcessingContext {
    source?: string;
    priority?: number;
    options?: Record<string, any>;
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

export type DataFormat = 'json' | 'csv' | 'xml' | 'text';

// Error Types

export class SystemError extends Error {
    constructor(
        message: string,
        public code: string,
        public details?: any
    ) {
        super(message);
        this.name = 'SystemError';
    }
}

export class ValidationError extends SystemError {
    constructor(
        message: string,
        public errors: string[]
    ) {
        super(message, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
    }
}

export class ProcessingError extends SystemError {
    constructor(
        message: string,
        public processId: string,
        public retry?: boolean
    ) {
        super(message, 'PROCESSING_ERROR');
        this.name = 'ProcessingError';
    }
}

// Utility Types

export interface Confidence {
    score: number;
    factors: Record<string, number>;
}

export interface TimeRange {
    start: number;
    end: number;
}

export interface PaginationOptions {
    offset: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface QueryOptions extends PaginationOptions {
    filters?: Record<string, any>;
    includeMetadata?: boolean;
    fields?: string[];
}
