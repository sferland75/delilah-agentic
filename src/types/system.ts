export interface SystemState {
    status: SystemStatus;
    activeProcesses: Map<string, ProcessInfo>;
    agentStatus: Map<string, AgentStatus>;
    errors: SystemError[];
}

export type SystemStatus = 
    | 'initializing'
    | 'ready'
    | 'processing'
    | 'error'
    | 'shutting_down'
    | 'shutdown';

export interface ProcessInfo {
    startTime: number;
    status: string;
    data: any;
    promise?: Promise<any>;
}

export interface AgentStatus {
    status: 'ready' | 'processing' | 'error' | 'inactive';
    lastActive: number | null;
    lastError?: string;
}

export interface SystemError {
    timestamp: number;
    component: string;
    processId?: string;
    message: string;
}

export interface ProcessingResult {
    processId: string;
    timestamp: number;
    analysis: any;
    assessment: any;
    report: any;
    metadata: {
        processingTime: number;
        learningEnabled: boolean;
    };
}

export class SystemError extends Error {
    constructor(
        message: string,
        public component: string,
        public processId?: string
    ) {
        super(message);
        this.name = 'SystemError';
    }
}

export class ProcessingError extends SystemError {
    constructor(
        message: string,
        component: string,
        processId: string,
        public retry?: boolean
    ) {
        super(message, component, processId);
        this.name = 'ProcessingError';
    }
}
