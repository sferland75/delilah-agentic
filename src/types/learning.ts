export interface LearningEvent {
    type: string;
    data: any;
    source: string;
    timestamp?: number;
}

export interface Pattern {
    id: string;
    type: string;
    confidence?: number;
    features?: PatternFeature[];
    correlations?: string[];
    content?: string;
    lastUpdated: number;
    source?: string;
}

export interface PatternFeature {
    name: string;
    type?: string;
    value?: any;
    confidence?: number;
    metadata?: Record<string, any>;
}

export interface PatternUpdate {
    pattern: Pattern;
    isNew: boolean;
    timestamp: number;
    source?: string;
}

export interface LearningStats {
    totalPatterns: number;
    averageConfidence: number;
    recentUpdates: number;
    lastUpdate?: number;
}

export type EventHandler = (event: LearningEvent) => Promise<void> | void;

export interface LearningSubscriber {
    eventType: string;
    handler: EventHandler;
    priority?: number;
}

export class LearningError extends Error {
    constructor(
        message: string,
        public code: string,
        public event?: LearningEvent
    ) {
        super(message);
        this.name = 'LearningError';
    }
}
