export interface MetricData {
    name: string;
    value: number;
    unit?: string;
    timestamp: number;
    componentId: string;
    tags?: Record<string, string>;
}

export interface MetricsQuery {
    componentId?: string;
    metricName?: string;
    startTime?: number;
    endTime?: number;
    aggregation?: 'avg' | 'sum' | 'min' | 'max' | 'count';
    interval?: number;
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

export interface AlertState {
    id: string;
    active: boolean;
    lastTriggered: number | null;
    lastResolved: number | null;
    occurrences: number;
}

export interface MonitoringEvent {
    type: string;
    componentId: string;
    timestamp: number;
    data: any;
    metadata?: Record<string, any>;
}

export class MonitoringError extends Error {
    constructor(
        message: string,
        public componentId: string,
        public code: string
    ) {
        super(message);
        this.name = 'MonitoringError';
    }
}

export interface ComponentHealth {
    status: HealthStatus;
    metrics: MetricData[];
    alerts: AlertConfig[];
    lastUpdate: number;
}